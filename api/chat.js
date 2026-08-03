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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.Gemini_API_Key_4}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log(data);

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response.";

    res.status(200).json({
      reply
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to connect to Gemini."
    });

  }

}
