export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const { message, history } = req.body;

    let prompt = `
You are Bearly AI Assistant 🧸.

You are a friendly, professional, and intelligent AI assistant.

IMPORTANT LANGUAGE RULES:
- Always reply ONLY in the same language as the user's latest message.
- Never mix languages unless the user requests it.
- If the user writes in Javanese, reply naturally in Javanese.
- Keep answers concise.
- Maximum 200 words.
- Use 1–3 emojis naturally.

Conversation:
`;

    if (Array.isArray(history)) {
      history.slice(-4).forEach(item => {
        prompt += `${item.role}: ${item.content}\n`;
      });
    }

    prompt += `user: ${message}`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      }
    );

    const data = await response.json();

    console.log(data);

    const reply =
      data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    res.status(200).json({
      reply
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to connect to Groq."
    });

  }

}
