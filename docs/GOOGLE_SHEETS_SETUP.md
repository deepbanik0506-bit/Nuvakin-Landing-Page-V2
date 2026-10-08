# Waitlist → Google Sheets setup

The waitlist form posts to the site's own `/api/waitlist` route. That route validates
the submission and forwards it, server-side, to a Google Apps Script web app bound to a
Google Sheet. No Google credentials ever reach the browser or this repository.

```
Browser form ──► /api/waitlist (Next.js, server) ──► Apps Script web app ──► Google Sheet
                 validation, honeypot,              shared-secret check,
                 rate limit, timing check           duplicate check (locked), append
```

Setup takes about ten minutes and needs a Google account that should own the data.

## 1. Create the sheet

1. Go to <https://sheets.new> and name the spreadsheet **Nuvakin Waitlist**.
2. Leave it empty. On the first submission the script creates a tab named **Waitlist**
   with a frozen header row: `Timestamp | Name | Email | Phone | Source`.
3. Optional: **File → Settings → Time zone** sets how timestamps are displayed.

## 2. Add the script

1. In the sheet, open **Extensions → Apps Script**.
2. Replace the contents of `Code.gs` with [`apps-script/Code.gs`](../apps-script/Code.gs).
3. Optional: **Project Settings → Show "appsscript.json"**, then paste
   [`apps-script/appsscript.json`](../apps-script/appsscript.json).
4. Save, and name the project **Nuvakin Waitlist**.

## 3. Set the shared secret

1. Generate a long random value, for example by running `openssl rand -hex 32` in a terminal.
2. In Apps Script, open **Project Settings → Script Properties → Add script property**:
   - Property: `WAITLIST_SECRET`
   - Value: the random value
3. Save. Keep this value; the website needs the same value (step 5).

## 4. Deploy as a web app

1. Click **Deploy → New deployment**, then choose the type **Web app** (gear icon).
2. Description: `Nuvakin waitlist v1`
3. **Execute as: Me**. The script writes to the sheet as the sheet owner.
4. **Who has access: Anyone**. This is needed so the website's server can call it
   without a Google login. Requests without the shared secret are rejected.
5. Click **Deploy**, authorise the permissions it asks for (access to this spreadsheet),
   and copy the **Web app URL** (it ends in `/exec`).
6. Sanity check: open the URL in a browser. You should see
   `{"ok":true,"service":"nuvakin-waitlist"}`.

> If you later edit the script, use **Deploy → Manage deployments → Edit → Version: New
> version** to keep the same URL. **New deployment** creates a different URL.

## 5. Configure the website

Set these **server-side** environment variables wherever the site runs (Vercel:
**Project → Settings → Environment Variables**; locally: `.env.local`):

| Variable                 | Value                                  |
| ------------------------ | -------------------------------------- |
| `WAITLIST_ENDPOINT_URL`  | the `/exec` web app URL from step 4    |
| `WAITLIST_SHARED_SECRET` | the same value as `WAITLIST_SECRET`    |

They must **not** be prefixed with `NEXT_PUBLIC_`. Redeploy after setting them.

## 6. Test

1. Submit the form on the site with your own details. You should see **"You're on the list."**
   and a new row in the sheet.
2. Submit the same email again. You should see **"You're already on the list."** and no
   new row.

## Behaviour reference

| Situation                         | What the visitor sees                                    | Sheet          |
| --------------------------------- | -------------------------------------------------------- | -------------- |
| Valid, new email                  | "You're on the list."                                    | Row appended   |
| Email already registered          | "You're already on the list."                            | Unchanged      |
| Invalid / missing field           | Inline message on the field                              | Unchanged      |
| Apps Script error / unreachable   | "Something went wrong… your details were not saved."     | Unchanged      |
| Env vars missing / wrong secret   | "The waitlist is temporarily unavailable…" (logged)      | Unchanged      |
| Visitor offline                   | "We couldn't reach our server…"                          | Unchanged      |
| Honeypot filled (bot)             | Generic success                                          | Unchanged      |
| More than 8 attempts / 10 min / IP | "Too many attempts…"                                    | Unchanged      |

Duplicate checks are case-insensitive and run inside a script lock, so two simultaneous
submissions of the same email cannot both be stored. The phone number is stored as text
(digits with an optional leading `+`). Values starting with `=`, `+`, `-` or `@` are stored
as text so they are never evaluated as formulas.

## Troubleshooting

- **"temporarily unavailable" on every submission:** check that both env vars are set
  in the deployment environment and that `WAITLIST_SECRET` matches exactly. Server logs say which.
- **Server log says "non-JSON":** the web app access is not **Anyone**, or the URL is
  the editor URL rather than the `/exec` deployment URL.
- **Edits to the script have no effect:** publish a new version of the existing
  deployment (see the note in step 4).

## Local development without Google

```bash
node scripts/mock-waitlist-endpoint.mjs          # mock Apps Script on :8787
# .env.local
WAITLIST_ENDPOINT_URL=http://localhost:8787
WAITLIST_SHARED_SECRET=dev-secret
```

The mock implements the same contract. Emails starting with `fail@`, `slow@` or `html@`
simulate a script error, a slow response, and a misconfigured deployment.
