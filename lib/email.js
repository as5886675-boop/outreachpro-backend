const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "OutreachPro
<noreply@yourdomain.com>";
// Change FROM_EMAIL to your verified email in Resend,
e.g. "Akash <akash@yourdomain.com>"
// Send a cold outreach email to a business
export async function sendColdEmail({ toEmail, subject,
body }) {
 const payload = {
 from: FROM_EMAIL,
 to: toEmail,
 subject,
 text: body,
 html: `<pre style="font-family:Arial,sans-serif;fontsize:14px;line-height:1.7;white-space:prewrap;">${body}</pre>`,
 };
 const res = await
fetch("https://api.resend.com/emails", {
 method: "POST",
 headers: { Authorization: `Bearer ${RESEND_API_KEY}`,
"Content-Type": "application/json" },
 body: JSON.stringify(payload),
 });
 const data = await res.json();
 if (!res.ok) throw new Error(`Email failed:
${JSON.stringify(data)}`);
 return data;
}
export async function sendLicenseEmail({ toEmail, toName,
licenseKey, expiryDate }) {
 const body = {
 from: FROM_EMAIL,
 to: toEmail,
 subject: "Your OutreachPro License Key 🎉",
 html: `
<!DOCTYPE html>
<html>
<body style="font-family: 'Segoe UI', Arial, sans-serif;
background: #0f0f0f; color: #ffffff; margin: 0; padding:
0;">
 <div style="max-width: 520px; margin: 40px auto;
background: #18181b; border-radius: 16px; overflow:
hidden; border: 1px solid #27272a;">

 <!-- Header -->
 <div style="background: #ea580c; padding: 32px; textalign: center;">
 <div style="font-size: 32px; margin-bottom:
8px;">⚡</div>
 <h1 style="margin: 0; font-size: 22px; font-weight:
800; color: white;">OutreachPro</h1>
 <p style="margin: 6px 0 0; color:
rgba(255,255,255,0.85); font-size: 14px;">Your
subscription is active!</p>
 </div>
 <!-- Body -->
 <div style="padding: 32px;">
 <p style="font-size: 16px; color: #e4e4e7; margin:
0 0 20px;">Hi ${toName || "there"},</p>
 <p style="font-size: 14px; color: #a1a1aa; margin:
0 0 24px; line-height: 1.6;">
 Thank you for subscribing to OutreachPro! Your
AI-powered cold email system is ready. Here is your
license key:
 </p>
 <!-- License Key Box -->
 <div style="background: #09090b; border: 2px dashed
#ea580c; border-radius: 12px; padding: 20px; text-align:
center; margin-bottom: 24px;">
 <p style="margin: 0 0 6px; font-size: 11px;
color: #71717a; text-transform: uppercase; letterspacing: 1px;">Your License Key</p>
 <p style="margin: 0; font-size: 22px; fontweight: 800; color: #ea580c; font-family: monospace;
letter-spacing: 2px;">${licenseKey}</p>
 <p style="margin: 8px 0 0; font-size: 11px;
color: #52525b;">Valid until: ${expiryDate}</p>
 </div>
 <!-- How to activate -->
 <div style="background: #1c1c1e; border-radius:
10px; padding: 20px; margin-bottom: 24px;">
 <p style="margin: 0 0 12px; font-size: 13px;
font-weight: 700; color: #e4e4e7;">How to activate:</p>
 <ol style="margin: 0; padding-left: 18px; color:
#a1a1aa; font-size: 13px; line-height: 2;">
 <li>Open the OutreachPro app</li>
 <li>Select <strong
style="color:#ea580c;">Monthly Plan</strong></li>
 <li>Enter your name and city</li>
 <li>Paste the license key above</li>
 <li>Click <strong
style="color:#ea580c;">Activate</strong></li>
 </ol>
 </div>
 <p style="font-size: 13px; color: #71717a; margin:
0 0 6px;">Questions? Just reply to this email.</p>
 <p style="font-size: 13px; color: #71717a; margin:
0;">— Akash, OutreachPro</p>
 </div>
 <!-- Footer -->
 <div style="padding: 16px 32px; border-top: 1px solid
#27272a; text-align: center;">
 <p style="margin: 0; font-size: 11px; color:
#52525b;">
 You received this because you purchased
OutreachPro.<br/>
 This license is for 1 user only. Do not share it.
 </p>
 </div>
 </div>
</body>
</html>
 `,
 };
 const res = await
fetch("https://api.resend.com/emails", {
 method: "POST",
 headers: {
 Authorization: `Bearer ${RESEND_API_KEY}`,
 "Content-Type": "application/json",
 },
 body: JSON.stringify(body),
 });
 const data = await res.json();
 if (!res.ok) throw new Error(`Email failed:
${JSON.stringify(data)}`);
 return data;
}
