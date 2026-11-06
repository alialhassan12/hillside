import { api } from "../lib/api";
import { isNotFound } from "../lib/apiErrors";
import type { Service, ServicesResponse } from "../types/service";
import type { ServiceDetail, ServiceDetailsResponse } from "../types/service";

// Laravel returns rows in no fixed order (an edited row can move),
// so sort by creation time to keep lists stable.
function byCreatedAt<T extends { created_at: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.created_at.localeCompare(b.created_at));
}

export async function getServices(): Promise<Service[]> {
  const response = await api.get<ServicesResponse>("/services");

  return byCreatedAt(response.data.data);
}

export async function getServiceDetails(
  serviceId: string,
): Promise<ServiceDetail[]> {
  try {
    const response = await api.get<ServiceDetailsResponse>(
      `/services/details/${encodeURIComponent(serviceId)}`,
    );

    return byCreatedAt(response.data.data);
  } catch (error) {
    // Laravel answers 404 when a service has no details yet.
    if (isNotFound(error)) return [];
    throw error;
  }
}

export type CreateServiceData = {
  name: string;
  description: string;
  icon: File;
};

export async function createService(data: CreateServiceData) {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("icon", data.icon);

  const response = await api.post("/services", formData);

  return response.data;
}

export type UpdateServiceData = {
  id: string;
  name: string;
  description: string;
  icon?: File;
};

export async function updateService(data: UpdateServiceData) {
  const formData = new FormData();

  formData.append("id", data.id);
  formData.append("name", data.name);
  formData.append("description", data.description);

  if (data.icon) {
    formData.append("icon", data.icon);
  }

  const response = await api.put("/services/update", formData);

  return response.data;
}

export async function deleteService(id: string) {
  const response = await api.delete(
    `/services/delete/${encodeURIComponent(id)}`,
  );

  return response.data;
}

export type CreateServiceDetailData = {
  service_id: string;
  title: string;
  description: string;
  image: File;
};

export async function createServiceDetail(data: CreateServiceDetailData) {
  const formData = new FormData();

  formData.append("service_id", data.service_id);
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("image", data.image);

  const response = await api.post("/services/details", formData);

  return response.data;
}

export type UpdateServiceDetailData = {
  id: string;
  title: string;
  description: string;
  image?: File;
};

export async function updateServiceDetail(data: UpdateServiceDetailData) {
  const formData = new FormData();

  formData.append("id", data.id);
  formData.append("title", data.title);
  formData.append("description", data.description);

  if (data.image) {
    formData.append("image", data.image);
  }

  const response = await api.put("/services/details/update", formData);

  return response.data;
}

export async function deleteServiceDetail(id: string) {
  const response = await api.delete(
    `/services/details/delete/${encodeURIComponent(id)}`,
  );

  return response.data;
}
