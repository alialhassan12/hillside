import { api } from "../lib/api";

export interface LoginResponse {
  message: string;
  token: string;
  user: { id: string; username: string };
}

// POST /api/login — returns a Sanctum token, or 401 "Invalid credentials".
export async function login(data: { username: string; password: string }) {
  const response = await api.post<LoginResponse>("/login", data);

  return response.data;
}

// POST /api/logout — revokes the current token on the server.
export async function logout() {
  await api.post("/logout");
}
