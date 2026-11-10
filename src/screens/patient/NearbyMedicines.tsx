import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { toast } from "react-toastify";
import { Check, FileWarning, LocateFixed, MapPin, Pill, Search, ShoppingCart, Truck } from "lucide-react";
import { Button, Card, ErrorState, LoadingState, PageHeader, Pill as Badge, buttonStyles, inputStyles } from "@/components/dashboard/ui";
import { EmptyState, InlineError, Toggle } from "@/components/dashboard/marketplace";
import { useAuth } from "@/hooks/useAuth";
import { apiErrorMessage } from "@/lib/apiError";
import { ABUJA_AREAS, currentPosition, formatNaira, type Coordinates } from "@/lib/marketplace";
import { cn } from "@/lib/utils";
import { useNearbyMedicines, usePatientAddresses } from "@/queries/use-checkout";
import type { NearbyMedicine } from "@/types/marketplace";

type Place = Coordinates & { label: string };

/** Find a medicine at the nearest approved pharmacy, delivering pharmacies first. */
export default function NearbyMedicines() {
  const [query, setQuery] = useState("");
  const [debounced] = useDebounce(query.trim(), 400);
  const [deliversOnly, setDeliversOnly] = useState(true);
  const [place, setPlace] = useState<Place | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const { data: addresses } = usePatientAddresses();

  useEffect(() => {
    document.title = "Medicines near me | DocLabPharm";
  }, []);

  // Start from the patient's default address when they have one.
  useEffect(() => {
    if (place || !addresses?.length) return;
    const home = addresses.find((a) => a.isDefault) ?? addresses[0];
    setPlace({ label: home.label, latitude: Number(home.latitude), longitude: Number(home.longitude) });
  }, [addresses, place]);

  const locate = async () => {
    setLocating(true);
    setLocationError("");
    try {
      const position = await currentPosition();
      setPlace({ ...position, label: "your current location" });
    } catch (e) {
      setLocationError((e as Error).message);
    } finally {
      setLocating(false);
    }
  };

  const search = useNearbyMedicines(
    place && debounced.length >= 2 ? { q: debounced, lat: place.latitude, lng: place.longitude, delivers: deliversOnly } : null
  );
  const results = search.data?.data ?? [];

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-1 py-2 sm:py-4">
      <PageHeader
        title="Medicines near me"
        intro="Search for a medicine and we will show the nearest verified pharmacies that have it in stock."
        actions={
          <Link to="/user/cart" className={buttonStyles("secondary")}>
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            View cart
          </Link>
        }
      />

      <Card className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="medicine-search" className="text-sm font-bold text-ink-700">
            Medicine name
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-500" aria-hidden="true" />
            <input
              id="medicine-search"
              type="search"
              className={cn(inputStyles, "pl-12")}
              placeholder="For example: paracetamol, amoxicillin"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="flex items-start gap-2 text-ink-700">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />
            {place ? (
              <span>
                Searching near <span className="font-bold">{place.label}</span>
              </span>
            ) : (
              <span>Tell us where you are so we can find the nearest pharmacy.</span>
            )}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button variant="secondary" onClick={locate} loading={locating}>
              <LocateFixed className="h-4 w-4" aria-hidden="true" />
              Use my current location
            </Button>
            <select
              aria-label="Or choose your area"
              className={cn(inputStyles, "sm:max-w-72")}
              value=""
              onChange={(e) => {
                const area = ABUJA_AREAS.find((a) => a.name === e.target.value);
                if (area) setPlace({ label: area.name, latitude: area.latitude, longitude: area.longitude });
              }}
            >
              <option value="">Or choose your area in Abuja</option>
              {ABUJA_AREAS.map((a) => (
                <option key={a.name} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <InlineError>{locationError}</InlineError>
        </div>

        <Toggle
          id="delivers-only"
          checked={deliversOnly}
          onChange={setDeliversOnly}
          label="Only pharmacies that deliver to me"
          description="Turn off to also see pharmacies where you can pick up."
        />
      </Card>

      {!place || debounced.length < 2 ? (
        <EmptyState icon={Pill} title="Search for a medicine">
          Type at least two letters of the medicine name{place ? "" : " and choose your location"}.
        </EmptyState>
      ) : search.isLoading ? (
        <LoadingState label="Finding pharmacies near you" />
      ) : search.isError ? (
        <ErrorState message={apiErrorMessage(search.error, "We could not search right now.")} onRetry={() => search.refetch()} />
      ) : results.length === 0 ? (
        <EmptyState icon={Search} title={`No "${debounced}" near ${place.label}`}>
          {deliversOnly
            ? "No pharmacy that delivers to you has it in stock. Turn off “Only pharmacies that deliver to me” to see pharmacies where you can pick up."
            : "No verified pharmacy nearby has it in stock right now. Try another name or spelling."}
        </EmptyState>
      ) : (
        <ul className="flex flex-col gap-3" aria-label="Medicines found">
          {results.map((medicine, index) => (
            <MedicineResult key={medicine.id} medicine={medicine} best={index === 0 && medicine.pharmacy.deliversHere} />
          ))}
        </ul>
      )}
    </div>
  );
}

function MedicineResult({ medicine, best }: { medicine: NearbyMedicine; best: boolean }) {
  const cart = useAuth().cartContext;
  const inCart = cart?.items.some((item) => item.service_type === "med" && item.product_id === medicine.id);

  const add = () => {
    cart?.addItem({
      service_type: "med",
      product_id: medicine.id,
      qty: 1,
      price: Number(medicine.price),
      name: medicine.name,
      stock: Number(medicine.inStock),
    });
    toast.success(`${medicine.name} added to your cart`);
  };

  const { pharmacy } = medicine;

  return (
    <li className={cn("rounded-3xl bg-white p-4 ring-1 sm:p-5", best ? "ring-2 ring-brand-500" : "ring-brand-100")}>
      {best && (
        <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-3 py-1 text-xs font-bold text-white">
          <Truck className="h-3.5 w-3.5" aria-hidden="true" />
          Nearest pharmacy that delivers
        </p>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-extrabold text-ink-900">{medicine.name}</h2>
            {medicine.prescriptionOnly && (
              <Badge tone="warm">
                <FileWarning className="h-3.5 w-3.5" aria-hidden="true" />
                Prescription needed
              </Badge>
            )}
          </div>
          {medicine.volume && <p className="text-sm text-ink-500">{medicine.volume}</p>}
          <p className="text-ink-700">
            <span className="font-bold">{pharmacy.name}</span> · {pharmacy.distanceKm} km away
          </p>
          <p className="text-sm text-ink-500">
            {pharmacy.deliversHere
              ? `Delivers to you for ${formatNaira(pharmacy.deliveryFee)}`
              : "Pickup only at your location"}
            {pharmacy.minOrderAmount > 0 && ` · Minimum order ${formatNaira(pharmacy.minOrderAmount)}`}
            {` · ${medicine.inStock} in stock`}
          </p>
        </div>
        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
          <p className="text-xl font-extrabold text-ink-900 tabular-nums">{formatNaira(medicine.price)}</p>
          {inCart ? (
            <Link to="/user/cart" className={buttonStyles("secondary")}>
              <Check className="h-4 w-4" aria-hidden="true" />
              In your cart
            </Link>
          ) : (
            <Button onClick={add} disabled={!cart}>
              <ShoppingCart className="h-4 w-4" aria-hidden="true" />
              Add to cart
            </Button>
          )}
        </div>
      </div>
    </li>
  );
}
