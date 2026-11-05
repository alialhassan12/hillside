import { useQuery } from "@tanstack/react-query";
import { getContacts } from "../services/contactApi";

export function useContacts() {
  return useQuery({
    queryKey: ["contacts"],
    queryFn: getContacts,
  });
}
