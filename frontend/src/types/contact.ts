export interface Contact {
  id: string;
  name: string;
  link: string;
  icon: string;
  icon_url: string;
  created_at: string;
  updated_at: string;
}

export interface ContactsResponse {
  message: string;
  data: Contact[];
}
