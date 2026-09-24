import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM ?? "Latter Day Shopping <onboarding@resend.dev>";
const REPLY_TO = process.env.EMAIL_REPLY_TO ?? "support@latterdayshopping.com";

function escapeHtml(s: string) {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

async function sendEmail(opts: {
    to: string;
    subject: string;
    html: string;
    replyTo?: string;
}) {
    if (!process.env.RESEND_API_KEY) {
        throw new Error("RESEND_API_KEY is not configured");
    }
    const { data, error } = await resend.emails.send({
        from: FROM,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
        replyTo: opts.replyTo ?? REPLY_TO,
    });
    if (error) {
        throw new Error(error.message || "Failed to send email");
    }
    return data;
}

export async function sendVendorApprovedEmail(to: string, name: string, shopName: string) {
    const safeName = escapeHtml(name);
    const safeShop = escapeHtml(shopName);
    await sendEmail({
        to,
        subject: "Your vendor account has been approved!",
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f4ff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(27,111,235,0.10)">
        <tr><td style="background:linear-gradient(135deg,#0d1b3e 0%,#1B6FEB 100%);padding:36px 40px">
          <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700">Latter Day Shopping</p>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.6);font-size:12px;text-transform:uppercase">Vendor Portal</p>
        </td></tr>
        <tr><td style="background:#10b981;height:4px;font-size:0;line-height:0">&nbsp;</td></tr>
        <tr><td style="padding:44px 40px 36px">
          <h1 style="margin:0 0 10px;font-size:26px;font-weight:700;color:#0f172a">You&apos;re approved, ${safeName}!</h1>
          <p style="margin:0 0 8px;font-size:15px;color:#64748b;line-height:1.7">
            Great news — your vendor account for <strong style="color:#0f172a">${safeShop}</strong> has been approved.
          </p>
          <p style="margin:0 0 32px;font-size:15px;color:#64748b;line-height:1.7">
            You can now log in to your vendor dashboard, list your products, and start selling.
          </p>
          <table cellpadding="0" cellspacing="0" style="margin-bottom:36px">
            <tr><td style="background:#1B6FEB;border-radius:12px">
              <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/login"
                 style="display:inline-block;color:#ffffff;font-weight:600;font-size:15px;padding:15px 32px;text-decoration:none">
                Go to Vendor Dashboard &rarr;
              </a>
            </td></tr>
          </table>
          <p style="margin:0;font-size:13px;color:#94a3b8">
            Need help? <a href="mailto:support@latterdayshopping.com" style="color:#1B6FEB;text-decoration:none">support@latterdayshopping.com</a>
          </p>
        </td></tr>
        <tr><td style="background:#f8fafc;padding:20px 40px;border-top:1px solid #e2e8f0">
          <p style="margin:0;font-size:12px;color:#94a3b8">&copy; ${new Date().getFullYear()} Latter Day Shopping. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    });
}

export async function sendInquiryReplyEmail(
    to: string,
    name: string,
    subject: string,
    originalMessage: string,
    replyText: string
) {
    const safeName = escapeHtml(name);
    const safeSubject = escapeHtml(subject);
    const safeOriginal = escapeHtml(originalMessage).replace(/\n/g, "<br>");
    const safeReply = escapeHtml(replyText).replace(/\n/g, "<br>");

    await sendEmail({
        to,
        subject: `Re: ${subject}`,
        replyTo: REPLY_TO,
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f4ff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(27,111,235,0.10)">
        <tr><td style="background:linear-gradient(135deg,#0d1b3e 0%,#1B6FEB 100%);padding:36px 40px">
          <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700">Latter Day Shopping</p>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.6);font-size:12px;text-transform:uppercase">Support Team</p>
        </td></tr>
        <tr><td style="background:#1B6FEB;height:4px;font-size:0;line-height:0">&nbsp;</td></tr>
        <tr><td style="padding:44px 40px 36px">
          <h1 style="margin:0 0 6px;font-size:22px;font-weight:700;color:#0f172a">Hi ${safeName},</h1>
          <p style="margin:0 0 28px;font-size:14px;color:#64748b">Thank you for reaching out. Here is our response to your inquiry about <strong>${safeSubject}</strong>.</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px">
            <tr><td style="background:#f8fafc;border-left:3px solid #1B6FEB;border-radius:0 8px 8px 0;padding:16px 20px">
              <p style="margin:0 0 6px;font-size:11px;font-weight:600;color:#94a3b8;text-transform:uppercase">Your original message</p>
              <p style="margin:0;font-size:14px;color:#475569;line-height:1.7">${safeOriginal}</p>
            </td></tr>
          </table>
          <p style="margin:0 0 10px;font-size:13px;font-weight:600;color:#94a3b8;text-transform:uppercase">Our reply</p>
          <p style="margin:0 0 32px;font-size:15px;color:#1e293b;line-height:1.8">${safeReply}</p>
          <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.6">
            Need further assistance? Reply to this email or contact us at
            <a href="mailto:${escapeHtml(REPLY_TO)}" style="color:#1B6FEB;text-decoration:none">${escapeHtml(REPLY_TO)}</a>
          </p>
        </td></tr>
        <tr><td style="background:#f8fafc;padding:20px 40px;border-top:1px solid #e2e8f0">
          <p style="margin:0;font-size:12px;color:#94a3b8">&copy; ${new Date().getFullYear()} Latter Day Shopping. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    });
}

export async function sendVendorRejectedEmail(to: string, name: string, shopName: string) {
    const safeName = escapeHtml(name);
    const safeShop = escapeHtml(shopName);
    await sendEmail({
        to,
        subject: "Update on your vendor application — Latter Day Shopping",
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f4ff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(27,111,235,0.10)">
        <tr><td style="background:linear-gradient(135deg,#0d1b3e 0%,#1B6FEB 100%);padding:36px 40px">
          <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700">Latter Day Shopping</p>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.6);font-size:12px;text-transform:uppercase">Vendor Portal</p>
        </td></tr>
        <tr><td style="background:#ef4444;height:4px;font-size:0;line-height:0">&nbsp;</td></tr>
        <tr><td style="padding:44px 40px 36px">
          <h1 style="margin:0 0 10px;font-size:26px;font-weight:700;color:#0f172a">Hi ${safeName},</h1>
          <p style="margin:0 0 16px;font-size:15px;color:#64748b;line-height:1.7">
            Thank you for applying to sell on Latter Day Shopping. After reviewing your application for
            <strong style="color:#0f172a">${safeShop}</strong>, we&apos;re unable to approve it at this time.
          </p>
          <p style="margin:0 0 32px;font-size:15px;color:#64748b;line-height:1.7">
            Please review our vendor guidelines and re-apply with an updated application.
          </p>
          <table cellpadding="0" cellspacing="0" style="margin-bottom:36px">
            <tr><td style="background:#1B6FEB;border-radius:12px">
              <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/vendor/register"
                 style="display:inline-block;color:#ffffff;font-weight:600;font-size:15px;padding:15px 32px;text-decoration:none">
                Re-apply Now &rarr;
              </a>
            </td></tr>
          </table>
          <p style="margin:0;font-size:13px;color:#94a3b8">
            Questions? <a href="mailto:support@latterdayshopping.com" style="color:#1B6FEB;text-decoration:none">support@latterdayshopping.com</a>
          </p>
        </td></tr>
        <tr><td style="background:#f8fafc;padding:20px 40px;border-top:1px solid #e2e8f0">
          <p style="margin:0;font-size:12px;color:#94a3b8">&copy; ${new Date().getFullYear()} Latter Day Shopping. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    });
}
