import { useMutation } from "@tanstack/react-query";
import type { MedicineSearch } from "@/types";
import api from "@/lib/axios";
import URIS from "@/queries/uris.json";

// write the function to search for medicines and it is a POST method
export const useSearchMedicine = () => {
  return useMutation({
    mutationFn: async ({ query }: MedicineSearch) => {
      const response = await api.post(`${URIS.search.medicineSearch}`, {
        query,
      });
      return response.data; // automatically camelCased
    },
  });
};
