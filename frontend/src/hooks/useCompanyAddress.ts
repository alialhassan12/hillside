import { useQuery } from "@tanstack/react-query";
import { getCompanyAddress } from "../services/companyApi";

export function useCompanyAddress() {
  return useQuery({
    queryKey: ["company-address"],
    queryFn: getCompanyAddress,
  });
}