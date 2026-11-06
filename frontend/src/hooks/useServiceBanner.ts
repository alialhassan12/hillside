import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getServicesBanner, updateServicesBanner } from "../services/companyApi";

export function useServicesBanner() {
  return useQuery({
    queryKey: ["services-banner"],
    queryFn: getServicesBanner,
  });
}

export function useUpdateServicesBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateServicesBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services-banner"] });
    },
  });
}
