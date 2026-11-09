// Cloudflare Worker: serves the static page from ./public and answers GET /config
// with the public settings the page needs, read from environment variables.
// Both values are safe to expose: an OAuth client ID is public by design,
// and the sheet is still protected by the user's own Google sign-in.

function config(env) {
  const body = {
    clientId: (env.GOOGLE_CLIENT_ID || "").trim(),
    sheetUrl: (env.SHEET_URL || "").trim(),
  };
  const missing = [];
  if (!body.clientId) missing.push("GOOGLE_CLIENT_ID");
  if (!body.sheetUrl) missing.push("SHEET_URL");

  return new Response(JSON.stringify(missing.length ? { ...body, missing } : body), {
    status: missing.length ? 500 : 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/config" && request.method === "GET") return config(env);
    return env.ASSETS.fetch(request);
  },
};
