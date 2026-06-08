// api/claude.js
// Claude AI proxy — hides your real API key from users.
// Validates license from database before calling Claude.
import { getLicense } from "../lib/db.js";
const rateLimits = {};
const MAX_REQUESTS_PER_HOUR = 50;
function checkRateLimit(key) {
 const now = Date.now();
 if (!rateLimits[key]) rateLimits[key] = [];
 rateLimits[key] = rateLimits[key].filter((t) => now - t
< 3600000);
 if (rateLimits[key].length >= MAX_REQUESTS_PER_HOUR)
return false;
 rateLimits[key].push(now);
 return true;
}
export default async function handler(req, res) {
 if (req.method === "OPTIONS") return
res.status(200).end();
 if (req.method !== "POST") return
res.status(405).json({ error: "Method not allowed" });
 const { messages, license_key } = req.body;
 if (!license_key) return res.status(401).json({ error:
"No license key" });
 try {
 const license = await
getLicense(license_key.trim().toUpperCase());
 if (!license || !license.active) return
res.status(401).json({ error: "Invalid license key" });
 if (license.expiry && new Date(license.expiry) < new
Date()) return res.status(401).json({ error: "License
expired" });
 if (!checkRateLimit(license_key)) return
res.status(429).json({ error: "Too many requests. Limit
is 50/hour." });
 const anthropicKey = process.env.ANTHROPIC_API_KEY;
 if (!anthropicKey) return res.status(500).json({
error: "Server not configured. Contact support." });
 const response = await
fetch("https://api.anthropic.com/v1/messages", {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 "x-api-key": anthropicKey,
 "anthropic-version": "2023-06-01",
 },
 body: JSON.stringify({ model: "claude-sonnet-4-
20250514", max_tokens: 1000, messages }),
 });
 const data = await response.json();
 return res.status(200).json(data);
 } catch (err) {
 return res.status(500).json({ error: "Server error",
detail: err.message });
 }
}
