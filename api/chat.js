export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const { message } = req.body;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + process.env.GROQ_API_KEY
        },

        body: JSON.stringify({

          model: "llama-3.3-70b-versatile",

          messages: [
            {
              role: "system",
              content: `
You are Bearly AI Assistant 🧸.

You are a friendly, professional, and intelligent AI assistant.

IMPORTANT LANGUAGE RULES:
- Detect the language of the USER'S LATEST MESSAGE.
- ALWAYS reply ONLY in the same language as the user's latest message.
- Never default to Indonesian.
- If the user writes in English, reply ONLY in English.
- If the user writes in Indonesian, reply ONLY in Indonesian.
- If the user writes in Japanese, reply ONLY in Japanese.
- If the user writes in Korean, reply ONLY in Korean.
- If the user writes in Arabic, reply ONLY in Arabic.
- If the user writes in another language, reply ONLY in that language whenever possible.
- Never mix languages unless the user explicitly requests it.

YOUR BEHAVIOR:
- Friendly and natural.
- Helpful and concise.
- Explain clearly.
- Use bullet points when appropriate.
- Do not invent facts.
- If you don't know something, say so honestly.
- If the user wants to practice a language, become their language tutor.
- Correct grammar politely when asked.
- Give examples whenever useful.

Always prioritize the user's latest message to determine the response language.
`
            },
            {
              role: "user",
              content: message
            }
          ]

        })
      }
    );

    const data = await response.json();

    const reply =
      data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    res.status(200).json({
      reply: reply
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to connect to Groq."
    });

  }

}
