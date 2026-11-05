import { api } from "../lib/api";
import type { Contact, ContactsResponse } from "../types/contact";

export async function getContacts(): Promise<Contact[]> {
  const response = await api.get<ContactsResponse>("/contact");

  return response.data.data;
}
