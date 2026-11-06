// Admin session storage. The Sanctum token is kept in localStorage so the
// admin stays logged in across reloads. Never log these values.

const TOKEN_KEY = "hillside_admin_token";
const USERNAME_KEY = "hillside_admin_username";
const USER_ID_KEY = "hillside_admin_id";

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

export function getUserId(): string | null {
  try {
    return localStorage.getItem(USER_ID_KEY);
  } catch {
    return null;
  }
}

// After the admin renames their own account.
export function saveUsername(username: string) {
  try {
    localStorage.setItem(USERNAME_KEY, username);
  } catch {
    // Storage blocked: the header shows the old name until next login.
  }
}

export function saveSession(token: string, username: string, userId: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USERNAME_KEY, username);
    localStorage.setItem(USER_ID_KEY, userId);
  } catch {
    // Storage blocked (private mode): the session lasts until reload.
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(USER_ID_KEY);
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
