import { useQuery } from "@tanstack/react-query";
import { getServiceDetails } from "../services/serviceApi";

export function useServiceDetails(serviceId: string | undefined) {
  return useQuery({
    queryKey: ["service-details", serviceId],
    queryFn: () => getServiceDetails(serviceId!),
    enabled: Boolean(serviceId),
  });
}
