import express from "express";
import fetch from "node-fetch"; // If using Node 18+, fetch is built-in
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());
app.use(express.json());

app.options("*", cors()); // Handle preflight requests

app.post("/generate-summary", async (req, res) => {
  try {
    const { name, experience, skills } = req.body;
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: "OPENAI_API_KEY is not configured" });
    }

    // Build context from user data
    const experienceText = experience
      .map((exp) => `${exp.title} at ${exp.company}: ${exp.description}`)
      .join("\n");

    const skillsText = skills.join(", ");

    const prompt = `You are a professional resume writer. Create a concise, impactful professional summary (2-3 sentences) for ${name}.

Experience:
${experienceText}

Skills: ${skillsText}

Write a compelling summary that highlights their key strengths, experience, and value proposition. Be specific and professional.`;

    console.log("Calling open AI Gateway...");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a professional resume writer helping create compelling professional summaries."
          },
          {
            role: "user",
            content: prompt
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return res.status(429).json({ error: "Rate limit exceeded. Please try again in a moment." });
      }
      if (response.status === 402) {
        return res.status(402).json({ error: "Credits exhausted. Please add credits to continue." });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to generate summary");
    }

    const data = await response.json();
    const summary = data.choices[0].message.content;

    res.json({ summary });

  } catch (error) {
    console.error("Error in generate-summary function:", error);
    res.status(500).json({ error: error.message || "Unknown error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
