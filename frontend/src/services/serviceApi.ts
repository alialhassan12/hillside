import { api } from "../lib/api";
import type { Service, ServicesResponse } from "../types/service";

export async function getServices(): Promise<Service[]> {
  const response = await api.get<ServicesResponse>("/services");

  return response.data.data;
}
