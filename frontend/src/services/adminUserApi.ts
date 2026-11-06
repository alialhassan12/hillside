import { api } from "../lib/api";

// Admin accounts (all routes need a login token).
// Note: the backend has no route to list admins yet.

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
