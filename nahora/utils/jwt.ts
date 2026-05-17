/**
 * Decodes the payload of a JWT access token without verifying the signature.
 * The JWT payload is a base64url-encoded JSON string.
 */
export function decodeJwtPayload<T = Record<string, unknown>>(
  token: string,
): T | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    if (!payload) return null;

    // Base64url decode → UTF-8 string
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

export function getTokenExp(token: string): number | null {
  const payload = decodeJwtPayload<{ exp?: number }>(token);
  return payload?.exp ?? null;
}

export function isTokenExpired(token: string): boolean {
  const exp = getTokenExp(token);
  if (!exp) return true;
  return Date.now() / 1000 > exp;
}
