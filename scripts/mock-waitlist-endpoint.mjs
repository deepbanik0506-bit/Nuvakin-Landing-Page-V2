/**
 * Local stand-in for the Google Apps Script web app, for development and QA.
 * Implements the same request/response contract as apps-script/Code.gs.
 *
 *   node scripts/mock-waitlist-endpoint.mjs        # listens on :8787
 *   WAITLIST_ENDPOINT_URL=http://localhost:8787 WAITLIST_SHARED_SECRET=dev-secret npm run dev
 *
 * Emails beginning with "fail@" simulate a script error, "slow@" a 4s delay,
 * and "html@" a non-JSON response (a deployment that is not public).
 */
import http from "node:http";

const PORT = Number(process.env.PORT ?? 8787);
const SECRET = process.env.WAITLIST_SHARED_SECRET ?? "dev-secret";
const rows = [];

const server = http.createServer((req, res) => {
  const send = (payload) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(payload));
  };
  if (req.method === "GET") return send({ ok: true, service: "nuvakin-waitlist (mock)", rows });

  let raw = "";
  req.on("data", (chunk) => (raw += chunk));
  req.on("end", async () => {
    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      return send({ ok: false, code: "error" });
    }
    if (body.secret !== SECRET) return send({ ok: false, code: "unauthorized" });

    const email = String(body.email ?? "").toLowerCase();
    if (email.startsWith("fail@")) return send({ ok: false, code: "error" });
    if (email.startsWith("html@")) {
      res.writeHead(200, { "Content-Type": "text/html" });
      return res.end("<html><body>Sign in</body></html>");
    }
    if (email.startsWith("slow@")) await new Promise((r) => setTimeout(r, 4000));
    if (rows.some((row) => row.email === email)) return send({ ok: false, code: "duplicate" });

    const row = { timestamp: new Date().toISOString(), name: body.name, email, phone: body.phone, source: body.source };
    rows.push(row);
    console.log("[mock-sheet] appended", row);
    send({ ok: true });
  });
});

server.listen(PORT, () => console.log(`Mock waitlist endpoint on http://localhost:${PORT}`));
