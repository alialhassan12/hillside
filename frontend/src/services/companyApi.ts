import { api } from "../lib/api";
import type {
  ContactBanner,
  ContactBannerResponse,
  ServicesBanner,
  ServicesBannerResponse,
} from "../types/company";

export async function getServicesBanner(): Promise<ServicesBanner> {
  const response = await api.get<ServicesBannerResponse>(
    "/company/services-banner",
  );

  return response.data.data;
}
export async function getContactBanner(): Promise<ContactBanner> {
  const response = await api.get<ContactBannerResponse>(
    "/company/contact-banner",
  );

  return response.data.data;
}
