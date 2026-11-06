import { api } from "../lib/api";
import type { About, AboutResponse } from "../types/about";

export async function getAbout(): Promise<About[]> {
  const response = await api.get<AboutResponse>("/about");

  // Keep a stable order; Laravel returns rows in no fixed order.
  return [...response.data.data].sort((a, b) =>
    a.created_at.localeCompare(b.created_at),
  );
}

export type UpdateAboutData = {
  id: string;
  title: string;
  text: string;
  image?: File;
  icon?: File;
};

export async function updateAbout(data: UpdateAboutData) {
  const formData = new FormData();

  formData.append("id", data.id);
  formData.append("title", data.title);
  formData.append("text", data.text);

  if (data.image) {
    formData.append("image", data.image);
  }

  if (data.icon) {
    formData.append("icon", data.icon);
  }

  const response = await api.put("/about/update", formData);

  return response.data;
}
