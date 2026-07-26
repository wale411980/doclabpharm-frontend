import { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useGetSpecializationsDoctorList } from "@/queries";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AvailableDoctorsLandingPage() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [, setShowFilter] = useState(false);
  const [filteredDoctors, setFilteredDoctors] = useState<any[]>([]);
  const filterRef = useRef<HTMLDivElement>(null);

  const [searchParams] = useSearchParams();
  const specializationId = searchParams.get("specialization_id");

  // Fetch doctors based on selected specialization
  const {
    data: doctors,
    isLoading,
    error,
  } = useGetSpecializationsDoctorList(Number(specializationId ?? 0));

  // Filter doctors when search or doctors change
  useEffect(() => {
    if (!doctors) return;
    let filtered = doctors;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (doctor: any) =>
          (doctor.name && doctor.name.toLowerCase().includes(query)) ||
          (doctor.firstName &&
            doctor.firstName.toLowerCase().includes(query)) ||
          (doctor.lastName && doctor.lastName.toLowerCase().includes(query)) ||
          (doctor.city && doctor.city.toLowerCase().includes(query)) ||
          (doctor.state && doctor.state.toLowerCase().includes(query)) ||
          (doctor.email && doctor.email.toLowerCase().includes(query))
      );
    }

    setFilteredDoctors(filtered);
  }, [searchQuery, doctors]);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilter(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!specializationId) {
      navigate("/"); // Or show modal
    }
  }, [specializationId, navigate]);

  const handleSelectDoctor = (doctorId: number) => {
    const currentParams = searchParams.toString();
    navigate(`/doctor/profile/${doctorId}?${currentParams}`);
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <Navbar currentPage="home" onNavigate={() => navigate("/")} />
        {/* Top bar */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between pt-40 px-10">
          <h1 className="text-2xl font-bold text-slate-800">
            Available Doctors
          </h1>
          <div className="relative w-full md:w-auto md:min-w-[400px]">
            <div className="flex items-center rounded-full border border-slate-200 bg-white px-4 py-2">
              <Search className="mr-2 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search Doctors..."
                className="flex-1 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Doctor list */}
        {isLoading ? (
          <div className="flex h-[60vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">Failed to load doctors</div>
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center text-gray-600">No doctors found</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pb-30 px-10">
            {filteredDoctors.map((doctor: any) => (
              <div
                key={doctor.id}
                onClick={() => handleSelectDoctor(doctor.id)}
                className="cursor-pointer overflow-hidden rounded-lg bg-white shadow-sm transition-all hover:shadow-md"
              >
                <div className="aspect-square w-full overflow-hidden">
                  <img src={doctor.profileImage} alt="" />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-slate-800">
                    {doctor.firstName} {doctor.lastName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {doctor.specialization?.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        <Footer />
      </div>
    </>
  );
}
