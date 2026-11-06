// Laravel enum on messages.status.
export type MessageStatus = "unread" | "read";

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  phone: string | null;
  message: string;
  status: MessageStatus;
  created_at: string;
  updated_at: string;
}

// Laravel's paginate() payload, returned under "data".
export interface MessagesPage {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  data: Message[];
}

export interface MessagesResponse {
  data: MessagesPage;
}
