# Sheets cell randomizer

Signs in with Google (OAuth, in the browser) and writes a random number into a random cell between A1 and C16 of a Google Sheet. Deploys to Cloudflare as a Worker with static assets.

```
public/index.html   the page (static)
src/worker.js       GET /config: returns GOOGLE_CLIENT_ID and SHEET_URL from env vars;
                    everything else is served from public/
wrangler.toml       Worker config (no build step)
```

## Environment variables

| Name               | Example                                                      |
| ------------------ | ------------------------------------------------------------ |
| `GOOGLE_CLIENT_ID` | `1234-abc.apps.googleusercontent.com`                        |
| `SHEET_URL`        | `https://docs.google.com/spreadsheets/d/<id>/edit#gid=0`     |

Both are public values (the page receives them in the browser), so plain text variables are fine; they don't need to be secrets. The `gid` in `SHEET_URL` picks the tab; without it, the first tab is used.

`wrangler.toml` sets `keep_vars = true`, so variables set in the dashboard survive each deploy.

## Google Cloud setup

1. Enable the **Google Sheets API** for your project.
2. Create an **OAuth client ID** of type *Web application*.
3. Under **Authorized JavaScript origins**, add every origin that will serve the page, e.g. `https://sheets-demo.<your-subdomain>.workers.dev`, any custom domain, and `http://localhost:8787` for local dev.

## Deploy

### Option A: Git integration (dashboard)

1. Cloudflare dashboard → Workers & Pages → Create → Import a repository, and pick this repo.
2. Build command: *(none)*. Deploy command: `npx wrangler deploy` (the default).
3. Settings → Variables and Secrets: add `GOOGLE_CLIENT_ID` and `SHEET_URL` as text variables.
4. Push a commit (or retry the deployment) so it redeploys.

### Option B: Wrangler CLI

Requires Node.js 22 or newer.

```bash
npx wrangler deploy
```

Then add the two variables in the dashboard (Settings → Variables and Secrets).

## Run locally

```bash
cp .dev.vars.example .dev.vars
```

Edit `.dev.vars` with your values (keep `SHEET_URL` in quotes so `#gid=…` isn't read as a comment), then:

```bash
npx wrangler dev
```

Open http://localhost:8787 (that origin must be in the OAuth client's authorized origins).
