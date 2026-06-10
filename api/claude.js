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
        "Authorization": `Bearer ${groqKey}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: messages,
        max_tokens: 2000,
        temperature: 0.3
      })
    });
    const data = await r.json();
    if (!r.ok) return res.status(500).json({ error: data.error?.message || "Groq error" });

    let text = data.choices?.[0]?.message?.content || "";

    // Remove any smart quotes that break JSON parsing
    text = text.replace(/[\u2018\u2019]/g, "'")
               .replace(/[\u201C\u201D]/g, '"')
               .replace(/[\u2013\u2014]/g, '-');

    return res.status(200).json({ content: [{ type: "text", text }] });
  } catch(err) {
    return res.status(500).json({ error: err.message });
  }
}
