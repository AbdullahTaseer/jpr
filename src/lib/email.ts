import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM ?? "Latter Day Shopping <onboarding@resend.dev>";

export async function sendVendorApprovedEmail(to: string, name: string, shopName: string) {
    await resend.emails.send({
        from: FROM,
        to,
        subject: "🎉 Your vendor account has been approved!",
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f4ff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(27,111,235,0.10)">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#0d1b3e 0%,#1B6FEB 100%);padding:36px 40px">
          <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.3px">Latter Day Shopping</p>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.6);font-size:12px;letter-spacing:0.5px;text-transform:uppercase">Vendor Portal</p>
        </td></tr>

        <!-- Green accent bar -->
        <tr><td style="background:#10b981;height:4px;font-size:0;line-height:0">&nbsp;</td></tr>

        <!-- Body -->
        <tr><td style="padding:44px 40px 36px">

          <!-- Icon circle — email-safe centering via line-height -->
          <div style="width:64px;height:64px;background:#d1fae5;border-radius:50%;text-align:center;line-height:64px;font-size:30px;color:#059669;margin-bottom:28px">&#10003;</div>

          <h1 style="margin:0 0 10px;font-size:26px;font-weight:700;color:#0f172a;letter-spacing:-0.5px">You&apos;re approved, ${name}!</h1>
          <p style="margin:0 0 8px;font-size:15px;color:#64748b;line-height:1.7">
            Great news — your vendor account for <strong style="color:#0f172a">${shopName}</strong> has been approved.
          </p>
          <p style="margin:0 0 32px;font-size:15px;color:#64748b;line-height:1.7">
            You can now log in to your vendor dashboard, list your products, and start selling to thousands of shoppers.
          </p>

          <!-- CTA button -->
          <table cellpadding="0" cellspacing="0" style="margin-bottom:36px">
            <tr><td style="background:#1B6FEB;border-radius:12px">
              <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/login"
                 style="display:inline-block;color:#ffffff;font-weight:600;font-size:15px;padding:15px 32px;text-decoration:none;letter-spacing:-0.1px">
                Go to Vendor Dashboard &rarr;
              </a>
            </td></tr>
          </table>

          <!-- Divider -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px">
            <tr><td style="border-top:1px solid #e2e8f0;font-size:0;line-height:0">&nbsp;</td></tr>
          </table>

          <!-- What's next checklist -->
          <p style="margin:0 0 14px;font-size:13px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.6px">What&apos;s next</p>
          <table cellpadding="0" cellspacing="0">
            <tr><td style="padding:5px 0;font-size:14px;color:#475569">
              <span style="display:inline-block;width:20px;height:20px;background:#eff6ff;border-radius:50%;text-align:center;line-height:20px;font-size:11px;color:#1B6FEB;font-weight:700;margin-right:10px;vertical-align:middle">1</span>
              Log in with your registered email and password
            </td></tr>
            <tr><td style="padding:5px 0;font-size:14px;color:#475569">
              <span style="display:inline-block;width:20px;height:20px;background:#eff6ff;border-radius:50%;text-align:center;line-height:20px;font-size:11px;color:#1B6FEB;font-weight:700;margin-right:10px;vertical-align:middle">2</span>
              Set up your shop profile and branding
            </td></tr>
            <tr><td style="padding:5px 0;font-size:14px;color:#475569">
              <span style="display:inline-block;width:20px;height:20px;background:#eff6ff;border-radius:50%;text-align:center;line-height:20px;font-size:11px;color:#1B6FEB;font-weight:700;margin-right:10px;vertical-align:middle">3</span>
              Add your products and start earning
            </td></tr>
          </table>

          <p style="margin:32px 0 0;font-size:13px;color:#94a3b8;line-height:1.6">
            Need help? Contact us at
            <a href="mailto:support@latterdayshopping.com" style="color:#1B6FEB;text-decoration:none">support@latterdayshopping.com</a>
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f8fafc;padding:20px 40px;border-top:1px solid #e2e8f0">
          <p style="margin:0;font-size:12px;color:#94a3b8">&copy; 2026 Latter Day Shopping. All rights reserved.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
    });
}

export async function sendInquiryReplyEmail(to: string, name: string, subject: string, originalMessage: string, replyText: string) {
    await resend.emails.send({
        from: FROM,
        to,
        subject: `Re: ${subject}`,
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f4ff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(27,111,235,0.10)">

        <tr><td style="background:linear-gradient(135deg,#0d1b3e 0%,#1B6FEB 100%);padding:36px 40px">
          <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.3px">Latter Day Shopping</p>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.6);font-size:12px;letter-spacing:0.5px;text-transform:uppercase">Support Team</p>
        </td></tr>

        <tr><td style="background:#1B6FEB;height:4px;font-size:0;line-height:0">&nbsp;</td></tr>

        <tr><td style="padding:44px 40px 36px">
          <h1 style="margin:0 0 6px;font-size:22px;font-weight:700;color:#0f172a;letter-spacing:-0.5px">Hi ${name},</h1>
          <p style="margin:0 0 28px;font-size:14px;color:#64748b">Thank you for reaching out. Here is our response to your inquiry.</p>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px">
            <tr><td style="background:#f8fafc;border-left:3px solid #1B6FEB;border-radius:0 8px 8px 0;padding:16px 20px">
              <p style="margin:0 0 6px;font-size:11px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.6px">Your original message</p>
              <p style="margin:0;font-size:14px;color:#475569;line-height:1.7">${originalMessage.replace(/\n/g, "<br>")}</p>
            </td></tr>
          </table>

          <p style="margin:0 0 10px;font-size:13px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.6px">Our reply</p>
          <p style="margin:0 0 32px;font-size:15px;color:#1e293b;line-height:1.8">${replyText.replace(/\n/g, "<br>")}</p>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px">
            <tr><td style="border-top:1px solid #e2e8f0;font-size:0;line-height:0">&nbsp;</td></tr>
          </table>

          <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.6">
            Need further assistance? Reply to this email or contact us at
            <a href="mailto:${FROM}" style="color:#1B6FEB;text-decoration:none">support@latterdayshopping.com</a>
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
    await resend.emails.send({
        from: FROM,
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

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#0d1b3e 0%,#1B6FEB 100%);padding:36px 40px">
          <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.3px">Latter Day Shopping</p>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.6);font-size:12px;letter-spacing:0.5px;text-transform:uppercase">Vendor Portal</p>
        </td></tr>

        <!-- Red accent bar -->
        <tr><td style="background:#ef4444;height:4px;font-size:0;line-height:0">&nbsp;</td></tr>

        <!-- Body -->
        <tr><td style="padding:44px 40px 36px">

          <!-- Icon circle — email-safe centering via line-height -->
          <div style="width:64px;height:64px;background:#fee2e2;border-radius:50%;text-align:center;line-height:64px;font-size:28px;color:#dc2626;margin-bottom:28px">&#10007;</div>

          <h1 style="margin:0 0 10px;font-size:26px;font-weight:700;color:#0f172a;letter-spacing:-0.5px">Hi ${name},</h1>
          <p style="margin:0 0 16px;font-size:15px;color:#64748b;line-height:1.7">
            Thank you for applying to sell on Latter Day Shopping. After carefully reviewing your application for
            <strong style="color:#0f172a">${shopName}</strong>, we&apos;re unable to approve it at this time.
          </p>
          <p style="margin:0 0 32px;font-size:15px;color:#64748b;line-height:1.7">
            This may be due to incomplete information or our current vendor criteria. We encourage you to review
            our vendor guidelines and re-apply with an updated application — we&apos;d love to have you on board.
          </p>

          <!-- CTA button -->
          <table cellpadding="0" cellspacing="0" style="margin-bottom:36px">
            <tr><td style="background:#1B6FEB;border-radius:12px">
              <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/vendor/register"
                 style="display:inline-block;color:#ffffff;font-weight:600;font-size:15px;padding:15px 32px;text-decoration:none;letter-spacing:-0.1px">
                Re-apply Now &rarr;
              </a>
            </td></tr>
          </table>

          <!-- Divider -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px">
            <tr><td style="border-top:1px solid #e2e8f0;font-size:0;line-height:0">&nbsp;</td></tr>
          </table>

          <!-- Tips -->
          <p style="margin:0 0 14px;font-size:13px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.6px">Tips for re-applying</p>
          <table cellpadding="0" cellspacing="0">
            <tr><td style="padding:5px 0;font-size:14px;color:#475569">
              <span style="display:inline-block;width:6px;height:6px;background:#cbd5e1;border-radius:50%;margin-right:10px;vertical-align:middle"></span>
              Ensure all business information is complete and accurate
            </td></tr>
            <tr><td style="padding:5px 0;font-size:14px;color:#475569">
              <span style="display:inline-block;width:6px;height:6px;background:#cbd5e1;border-radius:50%;margin-right:10px;vertical-align:middle"></span>
              Provide a valid EIN and company name
            </td></tr>
            <tr><td style="padding:5px 0;font-size:14px;color:#475569">
              <span style="display:inline-block;width:6px;height:6px;background:#cbd5e1;border-radius:50%;margin-right:10px;vertical-align:middle"></span>
              Choose a unique shop name and URL slug
            </td></tr>
          </table>

          <p style="margin:32px 0 0;font-size:13px;color:#94a3b8;line-height:1.6">
            Have questions? Contact us at
            <a href="mailto:support@latterdayshopping.com" style="color:#1B6FEB;text-decoration:none">support@latterdayshopping.com</a>
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f8fafc;padding:20px 40px;border-top:1px solid #e2e8f0">
          <p style="margin:0;font-size:12px;color:#94a3b8">&copy; 2026 Latter Day Shopping. All rights reserved.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
    });
}
