import { api } from "../lib/api";
import { isNotFound } from "../lib/apiErrors";
import type {
  MessageStatus,
  MessagesPage,
  MessagesResponse,
} from "../types/message";

export type MessageFilter = "all" | MessageStatus;

export async function getMessages(
  page: number,
  search: string,
  filter: MessageFilter = "all",
): Promise<MessagesPage> {
  try {
    const response = await api.get<MessagesResponse>("/messages", {
      params: {
        page,
        ...(search ? { search } : {}),
        ...(filter !== "all" ? { filter } : {}),
      },
    });

    return response.data.data;
  } catch (error) {
    // Laravel answers 404 when no messages match; treat it as an empty page.
    if (isNotFound(error)) {
      return { current_page: page, last_page: 1, per_page: 10, total: 0, data: [] };
    }
    throw error;
  }
}

export async function changeMessageStatus(data: {
  id: string;
  status: MessageStatus;
}) {
  const response = await api.put("/messages/status/change", data);

  return response.data;
}

export async function deleteMessage(id: string) {
  const response = await api.delete(
    `/messages/delete/${encodeURIComponent(id)}`,
  );

  return response.data;
}

export type SendMessageData = {
  name: string;
  email: string;
  subject: string;
  phone?: string;
  message: string;
};

export async function sendMessage(data: SendMessageData) {
  const response = await api.post("/messages/send", data);

  return response.data;
}
