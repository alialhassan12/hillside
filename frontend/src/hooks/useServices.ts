import { useQuery } from "@tanstack/react-query";
import { getServices } from "../services/serviceApi";

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });
}
