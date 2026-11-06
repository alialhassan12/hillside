import { api } from "../lib/api";
import type {
  ContactBanner,
  ContactBannerResponse,
  ServicesBanner,
  ServicesBannerResponse,
} from "../types/company";

import type { CompanyAddress, CompanyAddressResponse } from "../types/company";

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

export async function getCompanyAddress(): Promise<CompanyAddress> {
  const response = await api.get<CompanyAddressResponse>("/company/address");

  return response.data.data;
}

export async function updateServicesBanner(image: File) {
  const formData = new FormData();

  formData.append("services_banner_img", image);

  const response = await api.put("/company/services-banner/update", formData);

  return response.data;
}

export async function updateContactBanner(image: File) {
  const formData = new FormData();

  formData.append("contact_banner_img", image);

  const response = await api.put("/company/contact-banner/update", formData);

  return response.data;
}

export type UpdateCompanyAddressData = {
  address: string;
  address_icon?: File;
};

export async function updateCompanyAddress(data: UpdateCompanyAddressData) {
  const formData = new FormData();

  formData.append("address", data.address);

  if (data.address_icon) {
    formData.append("address_icon", data.address_icon);
  }

  const response = await api.put("/company/address/update", formData);

  return response.data;
}
