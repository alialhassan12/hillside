import { api } from "../lib/api";

// Admin accounts (all routes need a login token).

export interface AdminUser {
  id: string;
  username: string;
  created_at: string;
  updated_at: string;
}

// The backend lists admins with POST /api/users -> { users: [...] }.
export async function getAdmins(): Promise<AdminUser[]> {
  const response = await api.post<{ users: AdminUser[] }>("/users");

  return [...response.data.users].sort((a, b) =>
    a.created_at.localeCompare(b.created_at),
  );
}

export async function addAdmin(data: { username: string; password: string }) {
  const response = await api.post("/add-admin", data);

  return response.data;
}

// PUT /api/edit-admin — only the fields that are sent are changed.
export async function editAdmin(data: {
  id: string;
  username?: string;
  password?: string;
}) {
  const response = await api.put("/edit-admin", data);

  return response.data;
}

// The backend refuses to delete the last remaining admin.
export async function deleteAdmin(id: string) {
  const response = await api.delete(
    `/delete-admin/${encodeURIComponent(id)}`,
  );

  return response.data;
}
