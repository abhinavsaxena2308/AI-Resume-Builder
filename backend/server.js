import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ejs from "ejs";
import puppeteer from "puppeteer";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Correct CORS: remove trailing slash from frontend URL
const allowedOrigins = [
  "http://localhost:5173", // Vite dev server
  "https://ai-resume-builder-six-kappa.vercel.app" // Production frontend
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}));

app.get("/", (req, res) => res.send("✅ Backend is running!"));

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
Write ONE concise, polished, and professional summary (2–3 sentences) in FIRST PERSON for ${name}.
Start the summary with "I am".
Do NOT use the candidate's name, numbers, or formatting symbols (*, -, **, etc.).
Only return the final summary text, without any introductory lines.

Experience:
${experienceText}

Skills:
${skillsText}
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

app.post("/api/generate-pdf", async (req, res) => {
  try {
    const { resumeData, template = "modern" } = req.body;

    // Validate template
    const validTemplates = ["modern", "classic", "creative"];
    if (!validTemplates.includes(template)) {
      return res.status(400).json({ error: "Invalid template specified" });
    }

    // Render EJS template
    const templatePath = join(__dirname, "templates", `${template}.ejs`);
    const html = await ejs.renderFile(templatePath, { resumeData });

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "1cm",
        right: "1cm",
        bottom: "1cm",
        left: "1cm"
      }
    });

    await browser.close();

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${resumeData.personalInfo?.fullName || 'Resume'}.pdf"`);

    // Send PDF buffer
    res.send(pdfBuffer);

  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Gemini AI Resume Backend running at http://localhost:${PORT}`);
});
