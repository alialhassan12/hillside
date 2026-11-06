import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "../services/dashboardApi";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
    // Counts change from other admin pages; refresh on every visit.
    refetchOnMount: "always",
  });
}
