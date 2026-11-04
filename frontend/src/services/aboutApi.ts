import { api } from "../lib/api";
import type { About, AboutResponse } from "../types/about";

export async function getAbout(): Promise<About[]> {
  const response = await api.get<AboutResponse>("/about");

  return response.data.data;
}
