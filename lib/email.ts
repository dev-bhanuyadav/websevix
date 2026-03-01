import nodemailer from "nodemailer";

const host   = process.env.SMTP_HOST;
const port   = Number(process.env.SMTP_PORT)  || 465;
const secure = process.env.SMTP_SECURE !== "false"; // default true for port 465
const user   = process.env.SMTP_USER;
const pass   = process.env.SMTP_PASS;
const from   = process.env.SMTP_FROM ?? `"Websevix" <${user}>`;

if (!host || !user || !pass) {
  console.warn("[email] SMTP_HOST / SMTP_USER / SMTP_PASS missing — OTP emails will not send");
}

const transporter =
  host && user && pass
    ? nodemailer.createTransport({
        host,
        port,
        secure,          // true → TLS on connect (port 465)
        auth: { user, pass },
        tls: {
          // Allow self-signed certs on shared hosting
          rejectUnauthorized: false,
        },
      })
    : null;

// ── HTML email template ─────────────────────────────────────────────────────
export function getOTPEmailHtml(otp: string, expiryMinutes: number): string {
  const digitCells = otp
    .split("")
    .map(
      (d) =>
        `<td style="width:48px;height:56px;background:linear-gradient(145deg,#1e1e2e,#0e0e1a);
         border:1.5px solid rgba(99,102,241,0.45);border-radius:10px;text-align:center;
         font-size:26px;font-weight:700;font-family:monospace;color:#e2e8f0;">${d}</td>`
    )
    .join("<td style='width:6px'></td>");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#0A0A0F;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="440" cellpadding="0" cellspacing="0" style="max-width:440px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#6366F1 0%,#8B5CF6 55%,#06B6D4 100%);
              border-radius:14px 14px 0 0;padding:22px 28px;text-align:center;">
            <span style="color:#fff;font-size:20px;font-weight:700;letter-spacing:-0.3px;">
              ⬡ Websevix
            </span>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;border-radius:0 0 14px 14px;
              padding:32px 28px 28px;box-shadow:0 8px 32px rgba(0,0,0,0.25);">
            <p style="margin:0 0 6px;font-size:22px;font-weight:700;color:#0f172a;">
              Your verification code
            </p>
            <p style="margin:0 0 24px;font-size:14px;color:#64748b;line-height:1.5;">
              Use the code below to complete your sign-in to Websevix.
              It expires in <strong>${expiryMinutes} minutes</strong>.
            </p>

            <!-- OTP boxes -->
            <table cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
              <tr>${digitCells}</tr>
            </table>

            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;
                padding:12px 16px;margin-bottom:20px;">
              <p style="margin:0;font-size:12.5px;color:#475569;line-height:1.55;">
                🔒 <strong>Never share this code</strong> with anyone.
                Websevix will never ask for it via phone or chat.
              </p>
            </div>

            <p style="margin:0;font-size:12px;color:#94a3b8;">
              Didn't request this? You can safely ignore this email —
              your account is not affected.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:18px 0;text-align:center;">
            <p style="margin:0;font-size:11.5px;color:#475569;">
              Websevix · Web Services Platform ·
              <a href="mailto:login@websevix.com" style="color:#6366F1;text-decoration:none;">
                login@websevix.com
              </a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Send function ────────────────────────────────────────────────────────────
export async function sendOTPEmail(to: string, otp: string, expiryMinutes: number): Promise<void> {
  if (!transporter) {
    // Dev fallback — log OTP to console so you can test without SMTP
    console.warn(`[sendOTPEmail] No SMTP transporter. DEV OTP for ${to}: ${otp}`);
    return;
  }
  await transporter.sendMail({
    from,
    to,
    subject: `🔐 Your Websevix verification code: ${otp}`,
    html: getOTPEmailHtml(otp, expiryMinutes),
  });
}
