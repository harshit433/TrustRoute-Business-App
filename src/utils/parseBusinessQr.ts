const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Parse customer business QR payload into a single-use subscription token (UUID). */
export function parseBusinessQrToken(raw: string): string | null {
  const trimmed = raw.trim();
  if (UUID_RE.test(trimmed)) return trimmed.toLowerCase();

  const deepLink = trimmed.match(
    /^(?:trustroute|privid):\/\/(?:biz|business)\/([^?#\s/]+)/i,
  );
  if (deepLink) {
    try {
      const token = decodeURIComponent(deepLink[1]);
      return UUID_RE.test(token) ? token.toLowerCase() : null;
    } catch {
      return UUID_RE.test(deepLink[1]) ? deepLink[1].toLowerCase() : null;
    }
  }

  try {
    const json = JSON.parse(trimmed) as { token?: string };
    if (json.token && UUID_RE.test(json.token)) return json.token.toLowerCase();
  } catch {
    // not JSON
  }

  return null;
}
