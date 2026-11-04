import { api } from "../lib/api";
import type { Hero, HeroResponse } from "../types/hero";

export async function getHero(): Promise<Hero> {
  const response = await api.get<HeroResponse>("/hero");

  return response.data.data;
}
