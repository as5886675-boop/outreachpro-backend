const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN =
process.env.UPSTASH_REDIS_REST_TOKEN;
// Low-level Redis call
async function redis(command, ...args) {
 const res = await
fetch(`${UPSTASH_URL}/${command}/${args.map(encodeURIComp
onent).join("/")}`, {
 headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`
},
 });
 const data = await res.json();
 return data.result;
}
// Save a license key to database
export async function saveLicense(key, data) {
 await redis("SET", `license:${key}`,
JSON.stringify(data));
}
// Get a license by key
export async function getLicense(key) {
 const raw = await redis("GET", `license:${key}`);
 if (!raw) return null;
 return JSON.parse(raw);
}
// Deactivate a license (when subscription expires)
export async function deactivateLicense(key) {
 const license = await getLicense(key);
 if (!license) return;
 license.active = false;
 await saveLicense(key, license);
}
// Generate a unique license key
// Format: OP-XXXX-XXXX-XXXX
export function generateLicenseKey() {
 const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
 const segment = (len) =>
 Array.from({ length: len }, () =>
chars[Math.floor(Math.random() *
chars.length)]).join("");
 return `OP-${segment(4)}-${segment(4)}-${segment(4)}`;
}
