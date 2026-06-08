// api/validate.js
// Checks if a license key is valid.
// Now uses the database (Upstash Redis) instead of a
hardcoded list.
// Keys are added automatically when someone pays on
Gumroad.
import { getLicense } from "../lib/db.js";
export default async function handler(req, res) {
 if (req.method === "OPTIONS") return
res.status(200).end();
 if (req.method !== "POST") return
res.status(405).json({ error: "Method not allowed" });
 const { license_key } = req.body;
 if (!license_key) {
 return res.status(400).json({ valid: false, error:
"No license key provided" });
 }
 try {
 const license = await
getLicense(license_key.trim().toUpperCase());
 if (!license) {
 return res.status(200).json({ valid: false, error:
"License key not found" });
 }
 if (!license.active) {
 return res.status(200).json({ valid: false, error:
"License key is inactive" });
 }
 if (license.expiry && new Date(license.expiry) < new
Date()) {
 return res.status(200).json({ valid: false, error:
"License expired. Please renew." });
 }
 return res.status(200).json({
 valid: true,
 plan: license.plan,
 expiry: license.expiry,
 name: license.name,
 });
 } catch (err) {
 console.error("Validate error:", err);
 return res.status(500).json({ valid: false, error:
"Server error. Try again." });
 }
}
