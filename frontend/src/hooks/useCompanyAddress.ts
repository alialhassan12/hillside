import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCompanyAddress,
  updateCompanyAddress,
} from "../services/companyApi";

export function useCompanyAddress() {
  return useQuery({
    queryKey: ["company-address"],
    queryFn: getCompanyAddress,
  });
}

export function useUpdateCompanyAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCompanyAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-address"] });
    },
  });
}
