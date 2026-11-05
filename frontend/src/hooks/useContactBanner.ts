import { useQuery } from "@tanstack/react-query";
import { getContactBanner } from "../services/companyApi";

export function useContactBanner() {
  return useQuery({
    queryKey: ["contact-banner"],
    queryFn: getContactBanner,
  });
}