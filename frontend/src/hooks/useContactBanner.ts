import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getContactBanner, updateContactBanner } from "../services/companyApi";

export function useContactBanner() {
  return useQuery({
    queryKey: ["contact-banner"],
    queryFn: getContactBanner,
  });
}

export function useUpdateContactBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateContactBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-banner"] });
    },
  });
}
