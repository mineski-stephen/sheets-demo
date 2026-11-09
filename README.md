# Sheets cell randomizer

Signs in with Google (OAuth, in the browser) and writes a random number into a random cell between A1 and C16 of a Google Sheet. Built for Cloudflare Pages.

```
public/index.html     the page (static)
functions/config.js   GET /config: returns GOOGLE_CLIENT_ID and SHEET_URL from env vars
wrangler.toml         Pages config (output dir = public, no build step)
```

## Environment variables

| Name               | Example                                                      |
| ------------------ | ------------------------------------------------------------ |
| `GOOGLE_CLIENT_ID` | `1234-abc.apps.googleusercontent.com`                        |
| `SHEET_URL`        | `https://docs.google.com/spreadsheets/d/<id>/edit#gid=0`     |

Both are public values (the page receives them in the browser), so plain variables are fine; they don't need to be secrets. The `gid` in `SHEET_URL` picks the tab; without it, the first tab is used.

## Google Cloud setup

1. Enable the **Google Sheets API** for your project.
2. Create an **OAuth client ID** of type *Web application*.
3. Under **Authorized JavaScript origins**, add every origin that will serve the page, e.g. `https://sheets-demo.pages.dev`, any custom domain, and `http://localhost:8788` for local dev. Preview deployments (`https://<hash>.sheets-demo.pages.dev`) need adding individually if you want sign-in to work there.

## Deploy

### Option A: Git integration (dashboard)

1. Push this folder to GitHub/GitLab.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git.
3. Build command: *(none)*. Build output directory: `public`.
4. Settings → Variables and Secrets: add `GOOGLE_CLIENT_ID` and `SHEET_URL` (for Production, and Preview if you use it).
5. Redeploy so the variables take effect.

### Option B: Wrangler CLI

```bash
npx wrangler pages project create sheets-demo
```

```bash
npx wrangler pages deploy
```

Then add the two variables in the dashboard (Settings → Variables and Secrets) and deploy again.

## Run locally

```bash
cp .dev.vars.example .dev.vars
```

Edit `.dev.vars` with your values, then:

```bash
npx wrangler pages dev
```

Open http://localhost:8788 (that origin must be in the OAuth client's authorized origins).
