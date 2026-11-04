import { useQuery } from "@tanstack/react-query";
import { getAbout } from "../services/aboutApi";

export function useAbout() {
  return useQuery({
    queryKey: ["about"],
    queryFn: getAbout,
  });
}
