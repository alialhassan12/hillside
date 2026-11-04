import { api } from "../lib/api";
import type { AboutStat, AboutStatsResponse } from "../types/aboutStats";

export async function getAboutStats(): Promise<AboutStat[]> {
  const response = await api.get<AboutStatsResponse>("/about-stats");

  return response.data.data;
}
