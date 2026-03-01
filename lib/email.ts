import nodemailer from "nodemailer";

const user = process.env.GMAIL_USER;
const pass = process.env.GMAIL_APP_PASSWORD;

if (!user || !pass) {
  console.warn("GMAIL_USER or GMAIL_APP_PASSWORD missing — OTP emails will not send");
}

const transporter =
  user && pass
    ? nodemailer.createTransport({
        service: "gmail",
        auth: { user, pass },
      })
    : null;

export function getOTPEmailHtml(otp: string, expiryMinutes: number): string {
  const digits = otp.split("");
  const digitCells = digits
    .map(
      (d) =>
        `<td style="width:44px;height:52px;background:linear-gradient(145deg,#1e1e2e,#0e0e1a);border:1px solid rgba(99,102,241,0.4);border-radius:10px;text-align:center;font-size:24px;font-weight:700;font-family:monospace;color:#e2e8f0;letter-spacing:2px;">${d}</td>`
    )
    .join("");
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#0A0A0F;font-family:system-ui,sans-serif;padding:24px;">
  <div style="max-width:420px;margin:0 auto;">
    <div style="background:linear-gradient(135deg,#6366F1 0%,#8B5CF6 50%,#06B6D4 100%);border-radius:12px 12px 0 0;padding:20px;text-align:center;">
      <span style="color:rgba(255,255,255,0.95);font-size:18px;font-weight:700;">Websevix</span>
    </div>
    <div style="background:#fff;color:#1e293b;padding:28px;border-radius:0 0 12px 12px;box-shadow:0 4px 24px rgba(0,0,0,0.15);">
      <p style="margin:0 0 8px;font-size:14px;color:#64748b;">Your verification code</p>
      <table style="margin:16px auto;border-collapse:separate;border-spacing:8px;">
        <tr>${digitCells}</tr>
      </table>
      <p style="margin:16px 0 0;font-size:12px;color:#64748b;">Valid for ${expiryMinutes} minutes. Never share this code.</p>
      <p style="margin:12px 0 0;font-size:11px;color:#94a3b8;">If you didn't request this, you can ignore this email.</p>
    </div>
    <p style="text-align:center;font-size:11px;color:#475569;margin-top:16px;">Websevix · Web Services Platform</p>
  </div>
</body>
</html>`;
}

export async function sendOTPEmail(to: string, otp: string, expiryMinutes: number): Promise<void> {
  if (!transporter) {
    console.warn("[sendOTPEmail] No transporter — skipping send. OTP for dev:", otp);
    return;
  }
  await transporter.sendMail({
    from: `Websevix <${user}>`,
    to,
    subject: `🔐 Your Websevix verification code: ${otp}`,
    html: getOTPEmailHtml(otp, expiryMinutes),
  });
}
