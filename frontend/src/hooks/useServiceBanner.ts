import { useQuery } from "@tanstack/react-query";
import { getServicesBanner } from "../services/companyServicesApi";

export function useServicesBanner() {
  return useQuery({
    queryKey: ["services-banner"],
    queryFn: getServicesBanner,
  });
}
