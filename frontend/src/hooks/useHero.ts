import { useQuery } from "@tanstack/react-query";
import { getHero } from "../services/heroApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateHero } from "../services/heroApi";

export function useHero() {
  return useQuery({
    queryKey: ["hero"],
    queryFn: getHero,
  });
}

export function useUpdateHero() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateHero,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero"] });
    },
  });
}
