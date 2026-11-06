import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAbout, updateAbout } from "../services/aboutApi";

export function useAbout() {
  return useQuery({
    queryKey: ["about"],
    queryFn: getAbout,
  });
}

export function useUpdateAbout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAbout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about"] });
    },
  });
}
