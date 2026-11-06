import { api } from "../lib/api";
import type { Contact, ContactsResponse } from "../types/contact";

export async function getContacts(): Promise<Contact[]> {
  const response = await api.get<ContactsResponse>("/contact");

  // Laravel returns rows in no fixed order; keep the list stable.
  return [...response.data.data].sort((a, b) =>
    a.created_at.localeCompare(b.created_at),
  );
}

export type CreateContactData = {
  name: string;
  link: string;
  icon: File;
};

export async function createContact(data: CreateContactData) {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("link", data.link);
  formData.append("icon", data.icon);

  const response = await api.post("/contact", formData);

  return response.data;
}

export type UpdateContactData = {
  id: string;
  name: string;
  link: string;
  icon?: File;
};

export async function updateContact(data: UpdateContactData) {
  const formData = new FormData();

  formData.append("id", data.id);
  formData.append("name", data.name);
  formData.append("link", data.link);

  if (data.icon) {
    formData.append("icon", data.icon);
  }

  const response = await api.put("/contact/update", formData);

  return response.data;
}

export async function deleteContact(id: string) {
  const response = await api.delete(
    `/contact/delete/${encodeURIComponent(id)}`,
  );

  return response.data;
}
