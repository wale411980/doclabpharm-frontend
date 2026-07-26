import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetSpecializationList } from "@/queries";

interface SpecializationModalProps {
  open: boolean;
  onSelect: (specializationId: number) => void;
}

export function SpecializationModal({
  open,
  onSelect,
}: SpecializationModalProps) {
  const {
    data: specializations,
    isLoading,
    error,
  } = useGetSpecializationList();

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a Specialization</DialogTitle>
        </DialogHeader>

        {isLoading && <p>Loading...</p>}
        {error && <p>Failed to load specializations.</p>}

        {!isLoading && !error && (
          <Select onValueChange={(value) => onSelect(Number(value))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a specialization..." />
            </SelectTrigger>
            <SelectContent>
              {specializations?.map((item) => (
                <SelectItem key={item.id} value={String(item.id)}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </DialogContent>
    </Dialog>
  );
}
