export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { license_key } = req.body;
  if (!license_key) return res.status(400).json({ valid: false, error: "No license key provided" });

  // Valid licenses — add customers here
  const LICENSES = {
    "OP-AKASH-TEST-2025": { active: true, expiry: "2027-01-01" },
  };

  const license = LICENSES[license_key.trim().toUpperCase()];
  if (!license) return res.status(200).json({ valid: false, error: "License not found" });
  if (!license.active) return res.status(200).json({ valid: false, error: "License inactive" });
  if (new Date(license.expiry) < new Date()) return res.status(200).json({ valid: false, error: "License expired" });

  return res.status(200).json({ valid: true });
}
