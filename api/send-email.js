export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { resend_api_key, from_email, to_email, subject, body } = req.body;

  if (!resend_api_key || !resend_api_key.startsWith("re_")) return res.status(400).json({ error: "Invalid Resend API key" });
  if (!from_email || !from_email.includes("@")) return res.status(400).json({ error: "Invalid from email" });
  if (!to_email || !subject || !body) return res.status(400).json({ error: "Missing fields" });

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resend_api_key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: from_email,
        to: to_email,
        subject,
        text: body,
        html: `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.7;max-width:600px;color:#333;">${body.replace(/\n/g,"<br/>")}</div>`,
      }),
    });
    const data = await r.json();
    if (!r.ok) return res.status(400).json({ error: data.message || "Send failed" });
    return res.status(200).json({ success: true });
  } catch(err) {
    return res.status(500).json({ error: err.message });
  }
}
