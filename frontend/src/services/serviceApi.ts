import { api } from "../lib/api";
import type { Service, ServicesResponse } from "../types/service";
import type { ServiceDetail, ServiceDetailsResponse } from "../types/service";

export async function getServices(): Promise<Service[]> {
  const response = await api.get<ServicesResponse>("/services");

  return response.data.data;
}

export async function getServiceDetails(
  serviceId: string,
): Promise<ServiceDetail[]> {
  const response = await api.get<ServiceDetailsResponse>(
    `/services/details/${encodeURIComponent(serviceId)}`,
  );

  return response.data.data;
}
