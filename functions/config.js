// GET /config — exposes the public settings the page needs, read from
// Cloudflare Pages environment variables at request time.
// Both values are safe to expose: an OAuth client ID is public by design,
// and the sheet is still protected by the user's own Google sign-in.
export function onRequestGet({ env }) {
  const config = {
    clientId: (env.GOOGLE_CLIENT_ID || "").trim(),
    sheetUrl: (env.SHEET_URL || "").trim(),
  };
  const missing = [];
  if (!config.clientId) missing.push("GOOGLE_CLIENT_ID");
  if (!config.sheetUrl) missing.push("SHEET_URL");

  return new Response(JSON.stringify(missing.length ? { ...config, missing } : config), {
    status: missing.length ? 500 : 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
