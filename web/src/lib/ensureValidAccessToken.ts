import { BASE_URL, TokenManager } from "@ahmedrioueche/gympro-client";
import axios from "axios";

let refreshPromise: Promise<string | null> | null = null;

const decodeTokenExpiry = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
};

const refreshAccessToken = async (): Promise<string | null> => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const refreshToken = TokenManager.getRefreshToken();
      if (!refreshToken) return null;

      const res = await axios.post(
        `${BASE_URL()}/auth/refresh`,
        { refreshToken },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
      );

      const accessToken = res.data?.data?.accessToken;
      if (res.data?.success && accessToken) {
        TokenManager.setAccessToken(accessToken);
        return accessToken;
      }

      return null;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

/** Proactively refresh when token is missing, expired, or close to expiring. */
export const ensureValidAccessToken = async (
  refreshBufferMs = 60_000,
): Promise<boolean> => {
  const token = TokenManager.getAccessToken();
  if (!token) {
    return !!(await refreshAccessToken());
  }

  const expiresAt = decodeTokenExpiry(token);
  if (!expiresAt || expiresAt - Date.now() < refreshBufferMs) {
    return !!(await refreshAccessToken());
  }

  return true;
};
