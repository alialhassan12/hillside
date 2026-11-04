import { useQuery } from "@tanstack/react-query";
import { getHero } from "../services/heroApi";

export function useHero() {
  return useQuery({
    queryKey: ["hero"],
    queryFn: getHero,
  });
}
