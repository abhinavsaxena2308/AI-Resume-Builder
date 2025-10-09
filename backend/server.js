import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Correct CORS: remove trailing slash from frontend URL
const allowedOrigins = [
  "http://localhost:5173", // Vite dev server
  "https://ai-resume-builder-six-kappa.vercel.app" // Production frontend
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST"],
  credentials: true
}));


app.use(express.json());  

app.post("/generate-summary", async (req, res) => {
  try {
    const { name, experience = [], skills = [] } = req.body;

    if (!GOOGLE_API_KEY) {
      return res.status(500).json({ error: "GOOGLE_API_KEY not configured" });
    }

    // Format input data for prompt
    const experienceText = experience
      .map((exp) => `${exp.title} at ${exp.company}: ${exp.description}`)
      .join("\n");

    const skillsText = skills.join(", ");

    const prompt = `
    You are a professional resume writer.
    Write ONE concise, polished, and professional summary (2–3 sentences) for ${name}.
    Do NOT include any introductory lines (like “Here’s a summary for…”), numbers, or formatting symbols (*, -, **, etc.).
    Only return the final summary text.
    
    Experience:
    ${experienceText}
    
    Skills: ${skillsText}
    
    strictly do not inclue this line "Here's a concise and impactful professional summary for ${name}:"
    
    `;

    // Gemini API endpoint
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GOOGLE_API_KEY}`;

    // Call Gemini API
    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    const summary = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No summary generated.";

    res.json({ summary });
  } catch (error) {
    console.error("Error in generate-summary:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Gemini AI Resume Backend running at http://localhost:${PORT}`);
});
