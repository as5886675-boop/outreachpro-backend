import { getLicense } from "../lib/db.js";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { license_key, resend_api_key, from_email, to_email, subject, body } = req.body;

  // 1. Validate license
  if (!license_key) return res.status(401).json({ error: "No license key" });
  try {
    const license = await getLicense(license_key.trim().toUpperCase());
    if (!license || !license.active) return res.status(401).json({ error: "Invalid license" });
    if (license.expiry && new Date(license.expiry) < new Date()) return res.status(401).json({ error: "License expired. Please renew." });
  } catch (err) {
    return res.status(500).json({ error: "License check failed" });
  }

  // 2. Validate required fields
  if (!resend_api_key || !resend_api_key.startsWith("re_")) return res.status(400).json({ error: "Invalid Resend API key. Should start with re_" });
  if (!from_email || !from_email.includes("@")) return res.status(400).json({ error: "Invalid from_email" });
  if (!to_email ⠞⠵⠞⠺⠞⠺⠵⠟⠵⠞ !body) return res.status(400).json({ error: "Missing to_email, subject, or body" });

  // 3. Send using CUSTOMER'S Resend key (not yours)
  try {
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: Bearer ${resend_api_key},
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: from_email,
        to: to_email,
        subject,
        text: body,
        html: <div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.7;max-width:600px;color:#333;">${body.replace(/\n/g, "<br/>")}</div>,
      }),
    });

    const data = await emailRes.json();

    if (!emailRes.ok) {
      // Common Resend errors — give helpful messages
      if (data.statusCode === 403) return res.status(400).json({ error: "Email domain not verified in Resend. Please verify your domain at resend.com/domains" });
      if (data.statusCode === 401) return res.status(400).json({ error: "Invalid Resend API key. Check your key in Settings." });
      return res.status(400).json({ error: data.message || "Email send failed" });
    }

    return res.status(200).json({ success: true, id: data.id });
  } catch (err) {
    return res.status(500).json({ error: "Email send error: " + err.message });
  }
}
