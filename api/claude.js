export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { messages } = req.body;
  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) return res.status(500).json({ error: "Groq key not configured" });

  try {
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + groqKey
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: messages,
        max_tokens: 2000
      })
    });
    const data = await r.json();
    if (!r.ok) return res.status(500).json({ error: data.error?.message || "Groq error" });
    const text = data.choices?.[0]?.message?.content || "";
    return res.status(200).json({ content: [{ type: "text", text }] });
  } catch(err) {
    return res.status(500).json({ error: err.message });
  }
}
