import { useQuery } from "@tanstack/react-query";
import { getAboutStats } from "../services/aboutStatsApi";

export function useAboutStats() {
  return useQuery({
    queryKey: ["about-stats"],
    queryFn: getAboutStats,
  });
}
