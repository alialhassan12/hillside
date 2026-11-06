import { api } from "../lib/api";
import type { AboutStat, AboutStatsResponse } from "../types/aboutStats";

export async function getAboutStats(): Promise<AboutStat[]> {
  const response = await api.get<AboutStatsResponse>("/about-stats");

  // Laravel returns rows in no fixed order (an edited row can move),
  // so sort by creation time to keep the list stable.
  return [...response.data.data].sort((a, b) =>
    a.created_at.localeCompare(b.created_at),
  );
}

export type UpdateAboutStatData = {
  id: string;
  title: string;
  description: string;
};

export async function updateAboutStat(data: UpdateAboutStatData) {
  const response = await api.put("/about-stats/update", data);

  return response.data;
}
