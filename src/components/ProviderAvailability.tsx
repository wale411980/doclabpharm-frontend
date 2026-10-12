import { useMemo, useState } from "react";
import { format, addDays, isBefore, isAfter, parseISO } from "date-fns";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "react-toastify";
import {
  useGetProviderAvailability,
  useSetProviderAvailability,
  useDeleteProviderAvailability,
} from "@/queries";
import type { ProviderKind, ProviderAvailabilityEntry } from "@/queries";

interface ProviderAvailabilityProps {
  kind: ProviderKind;
  description: string;
}

const MAX_DAYS_AHEAD = 60;
const ITEMS_PER_PAGE = 15;

const timeOptions = (() => {
  const options: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      options.push(
        `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`
      );
    }
  }
  return options;
})();

// "HH:mm" (24h) -> "h:mm AM/PM"
const formatTimeForDisplay = (time: string) => {
  const [hours, minutes] = (time || "").split(":");
  const hour = Number.parseInt(hours, 10);
  if (Number.isNaN(hour)) return time;
  const ampm = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:${minutes} ${ampm}`;
};

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const isValidDate = (date: Date) =>
  !isBefore(date, startOfToday()) &&
  !isAfter(date, addDays(startOfToday(), MAX_DAYS_AHEAD));

const errorMessage = (error: any, fallback: string) => {
  const data = error?.response?.data;
  const firstFieldError = data?.errors
    ? (Object.values(data.errors)[0] as string[] | undefined)?.[0]
    : undefined;
  return firstFieldError || data?.message || data?.error || fallback;
};

export default function ProviderAvailability({
  kind,
  description,
}: ProviderAvailabilityProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [month, setMonth] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("17:00");
  const [repeatDays, setRepeatDays] = useState("1");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: entries, isLoading, isError } = useGetProviderAvailability(kind);
  const { mutate: saveAvailability, isPending } =
    useSetProviderAvailability(kind);
  const { mutate: deleteAvailability, isPending: isDeleting } =
    useDeleteProviderAvailability(kind);

  const todayKey = format(new Date(), "yyyy-MM-dd");

  const sortedEntries = useMemo(() => {
    const list = [...(entries ?? [])];
    const upcoming = list
      .filter((e) => e.date >= todayKey)
      .sort((a, b) => a.date.localeCompare(b.date));
    const past = list
      .filter((e) => e.date < todayKey)
      .sort((a, b) => b.date.localeCompare(a.date));
    return [...upcoming, ...past];
  }, [entries, todayKey]);

  const availableDates = useMemo(
    () =>
      (entries ?? [])
        .filter((e) => e.date >= todayKey)
        .map((e) => parseISO(e.date)),
    [entries, todayKey]
  );

  const selectedKey = format(date, "yyyy-MM-dd");
  const existingForSelected = (entries ?? []).find(
    (e) => e.date === selectedKey
  );

  const totalPages = Math.max(
    1,
    Math.ceil(sortedEntries.length / ITEMS_PER_PAGE)
  );
  const page = Math.min(currentPage, totalPages);
  const paginatedEntries = sortedEntries.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleDateChange = (newDate: Date | undefined) => {
    if (!newDate || !isValidDate(newDate)) return;
    setDate(newDate);
    const existing = (entries ?? []).find(
      (e) => e.date === format(newDate, "yyyy-MM-dd")
    );
    if (existing) {
      setStartTime(existing.startTime);
      setEndTime(existing.endTime);
    }
  };

  const handleSave = () => {
    if (startTime >= endTime) {
      toast.error("End time must be after start time", {
        position: "top-right",
      });
      return;
    }

    const days = Math.max(1, Number.parseInt(repeatDays, 10) || 1);
    const payload = [];
    for (let i = 0; i < days; i++) {
      const day = addDays(date, i);
      if (!isValidDate(day)) break;
      payload.push({
        date: format(day, "yyyy-MM-dd"),
        startTime,
        endTime,
      });
    }

    saveAvailability(payload, {
      onSuccess: () => {
        toast.success("Availability saved successfully!", {
          position: "top-right",
        });
      },
      onError: (error: any) => {
        toast.error(
          errorMessage(error, "Failed to save availability. Please try again."),
          { position: "top-right" }
        );
      },
    });
  };

  const handleDelete = (entry: ProviderAvailabilityEntry) => {
    deleteAvailability(entry.id, {
      onSuccess: () => {
        toast.success("Availability removed", { position: "top-right" });
      },
      onError: (error: any) => {
        toast.error(errorMessage(error, "Failed to remove availability."), {
          position: "top-right",
        });
      },
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="grid grid-cols-1 gap-6">
        <Card className="py-4">
          <CardHeader>
            <CardTitle>Set Availability</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-md p-4">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateChange}
                  month={month}
                  onMonthChange={setMonth}
                  disabled={(day) => !isValidDate(day)}
                  modifiers={{ available: availableDates }}
                  modifiersClassNames={{
                    available: "border border-green-600 rounded-md",
                  }}
                  className="rounded-md border"
                />
                <p className="text-xs text-muted-foreground mt-3">
                  Dates outlined in green already have availability set.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">
                  Availability for {format(date, "EEEE, MMMM d, yyyy")}
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="availability-start-time">Start Time</Label>
                    <Select value={startTime} onValueChange={setStartTime}>
                      <SelectTrigger
                        id="availability-start-time"
                        className="w-full"
                      >
                        <SelectValue placeholder="Select start time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={`start-${time}`} value={time}>
                            {formatTimeForDisplay(time)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availability-end-time">End Time</Label>
                    <Select value={endTime} onValueChange={setEndTime}>
                      <SelectTrigger
                        id="availability-end-time"
                        className="w-full"
                      >
                        <SelectValue placeholder="Select end time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={`end-${time}`} value={time}>
                            {formatTimeForDisplay(time)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availability-repeat">Apply to</Label>
                    <Select value={repeatDays} onValueChange={setRepeatDays}>
                      <SelectTrigger id="availability-repeat" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">This date only</SelectItem>
                        <SelectItem value="7">
                          This date and the next 6 days
                        </SelectItem>
                        <SelectItem value="14">
                          This date and the next 13 days
                        </SelectItem>
                        <SelectItem value="30">
                          This date and the next 29 days
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-2">Schedule</h4>
                  <div className="p-3 bg-muted rounded-md flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    <span>
                      Available from {formatTimeForDisplay(startTime)} to{" "}
                      {formatTimeForDisplay(endTime)}
                    </span>
                  </div>
                  {existingForSelected && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Currently saved for this date:{" "}
                      {formatTimeForDisplay(existingForSelected.startTime)} -{" "}
                      {formatTimeForDisplay(existingForSelected.endTime)}. Saving
                      replaces it.
                    </p>
                  )}
                </div>

                <Button
                  className="w-full mt-6 bg-green-700 hover:bg-green-800 cursor-pointer"
                  onClick={handleSave}
                  disabled={isPending}
                >
                  {isPending ? "Saving..." : "Save Availability"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader>
            <CardTitle>Your Availability</CardTitle>
            <CardDescription>
              Upcoming dates are listed first.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Start time</TableHead>
                    <TableHead>End time</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedEntries.length > 0 ? (
                    paginatedEntries.map((entry) => (
                      <TableRow
                        key={entry.id}
                        className={
                          entry.date < todayKey ? "text-muted-foreground" : ""
                        }
                      >
                        <TableCell>
                          {format(parseISO(entry.date), "EEE, MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          {formatTimeForDisplay(entry.startTime)}
                        </TableCell>
                        <TableCell>
                          {formatTimeForDisplay(entry.endTime)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700"
                            aria-label="Remove availability"
                            disabled={isDeleting}
                            onClick={() => handleDelete(entry)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-6 text-muted-foreground"
                      >
                        {isLoading
                          ? "Loading availability..."
                          : isError
                          ? "Could not load your availability."
                          : "You have not set any availability yet."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 pt-6">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(page - 1, 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {page} of {totalPages}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(page + 1, totalPages))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
