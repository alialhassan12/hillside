import { api } from "../lib/api";
import type {
  ServicesBanner,
  ServicesBannerResponse,
} from "../types/companyServices";

export async function getServicesBanner(): Promise<ServicesBanner> {
  const response = await api.get<ServicesBannerResponse>(
    "/company/services-banner",
  );

  return response.data.data;
}
