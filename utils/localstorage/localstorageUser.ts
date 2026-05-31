export type LocalStorageUser = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
};

export type LocalStorageAccessToken = {
  token: string;
  expires_in: number;
  created_at: string;
};

export type LocalStorageRefreshToken = {
  token: string;
  expires_in: number;
  created_at: string;
};

const USER_KEY = "user";
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

/* ---------------- USER ---------------- */

export function setLocalStorageUser(user: LocalStorageUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getLocalStorageUser(): LocalStorageUser | null {
  const data = localStorage.getItem(USER_KEY);

  if (!data) return null;

  try {
    return JSON.parse(data) as LocalStorageUser;
  } catch {
    return null;
  }
}

/* ---------------- ACCESS TOKEN ---------------- */

export function setLocalStorageAccessToken(
  token: LocalStorageAccessToken,
): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, JSON.stringify(token));
}

export function getLocalStorageAccessToken(): LocalStorageAccessToken | null {
  const data = localStorage.getItem(ACCESS_TOKEN_KEY);

  if (!data) return null;

  try {
    return JSON.parse(data) as LocalStorageAccessToken;
  } catch {
    return null;
  }
}

/* ---------------- REFRESH TOKEN ---------------- */
// WARNING: migrate this to cookies to prevent cross site scripting attacts
export function setLocalStorageRefreshToken(
  token: LocalStorageRefreshToken,
): void {
  localStorage.setItem(REFRESH_TOKEN_KEY, JSON.stringify(token));
}

export function getLocalStorageRefreshToken(): LocalStorageRefreshToken | null {
  const data = localStorage.getItem(REFRESH_TOKEN_KEY);

  if (!data) return null;

  try {
    return JSON.parse(data) as LocalStorageRefreshToken;
  } catch {
    return null;
  }
}
