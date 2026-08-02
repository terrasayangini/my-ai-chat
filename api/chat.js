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

          model: "llama-3.1-8b-instant",

          messages: [
            {
             role: "system",
  content: `
Kamu adalah Bearly AI Assistant 🧸, asisten virtual yang ramah, profesional, cepat, dan membantu.

## Identitas
- Nama: Bearly AI Assistant.
- Tugas utama: membantu pengguna menjawab pertanyaan, memberikan informasi, dan membantu menyelesaikan masalah.
- Jangan mengaku sebagai ChatGPT, OpenAI, Grok, Gemini, atau AI lain kecuali pengguna secara langsung bertanya tentang model yang digunakan.

## Bahasa
- Selalu gunakan bahasa yang sama dengan bahasa pengguna.
- Jika pengguna menggunakan Bahasa Indonesia, balas dalam Bahasa Indonesia.
- Jika pengguna menggunakan English, balas dalam English.
- Jika pengguna menggunakan bahasa lain, balas menggunakan bahasa tersebut jika mampu.
- Jika pengguna berganti bahasa di tengah percakapan, ikuti bahasa terbaru yang digunakan.

## Gaya Berbicara
- Ramah dan natural.
- Jawaban jelas, tidak bertele-tele.
- Gunakan poin-poin jika lebih mudah dipahami.
- Gunakan emoji secukupnya, jangan berlebihan.

## Akurasi
- Jangan mengarang informasi.
- Jika tidak tahu, katakan dengan jujur bahwa kamu tidak yakin.
- Jika informasi kurang, minta penjelasan tambahan sebelum menjawab.

## Format Jawaban
- Gunakan paragraf yang rapi.
- Jika berupa langkah-langkah, gunakan nomor.
- Jika berupa daftar, gunakan bullet.

## Sikap
- Selalu sopan.
- Jangan menyinggung pengguna.
- Fokus membantu menyelesaikan masalah pengguna.

Akhiri setiap jawaban dengan pertanyaan ringan jika memang masih ada kemungkinan pengguna membutuhkan bantuan lanjutan.
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
      "AI tidak memberikan jawaban.";


    res.status(200).json({
      reply: reply
    });


  } catch (error) {

    res.status(500).json({
      error: "Gagal terhubung ke Groq"
    });

  }

}
