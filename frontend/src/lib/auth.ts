// Admin session storage. The Sanctum token is kept in localStorage so the
// admin stays logged in across reloads. Never log these values.

const TOKEN_KEY = "hillside_admin_token";
const USERNAME_KEY = "hillside_admin_username";

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getUsername(): string | null {
  try {
    return localStorage.getItem(USERNAME_KEY);
  } catch {
    return null;
  }
}

export function saveSession(token: string, username: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USERNAME_KEY, username);
  } catch {
    // Storage blocked (private mode): the session lasts until reload.
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
  } catch {
    // Nothing to clear.
  }
}

// Only allow redirects back into the admin, never to another site.
export function safeAdminPath(path: string | null | undefined): string {
  return path && path.startsWith("/admin") && !path.startsWith("/admin/login")
    ? path
    : "/admin";
}
