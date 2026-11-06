import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAboutStats, updateAboutStat } from "../services/aboutStatsApi";

export function useAboutStats() {
  return useQuery({
    queryKey: ["about-stats"],
    queryFn: getAboutStats,
  });
}

export function useUpdateAboutStat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAboutStat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about-stats"] });
    },
  });
}
