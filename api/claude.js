export default async function handler(req, res) {
 if (req.method === "OPTIONS") return res.status(200).end();
 if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
 const { messages } = req.body;
 const geminiKey = process.env.GEMINI_API_KEY;
 if (!geminiKey) return res.status(500).json({ error: "Gemini API key not configured." });
 try {
 // Convert messages format to Gemini format
 const contents = messages.map(m => ({
 role: m.role === "assistant" ? "model" : "user",
 parts: [{ text: m.content }]
 }));
 const response = await fetch(
 `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-
flash:generateContent?key=${geminiKey}`,
 {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ contents }),
 }
 );
 const data = await response.json();
 if (!response.ok) {
 return res.status(500).json({ error: data.error?.message || "Gemini error" });
 }
 // Convert Gemini response back to Claude-compatible format
 const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
 return res.status(200).json({
 content: [{ type: "text", text }]
 });
 } catch (err) {
 return res.status(500).json({ error: "Server error: " + err.message });
 }
}
