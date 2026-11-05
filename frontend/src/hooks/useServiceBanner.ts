import { useQuery } from "@tanstack/react-query";
import { getServicesBanner } from "../services/companyApi";

export function useServicesBanner() {
  return useQuery({
    queryKey: ["services-banner"],
    queryFn: getServicesBanner,
  });
}
