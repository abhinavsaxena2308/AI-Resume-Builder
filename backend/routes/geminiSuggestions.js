import express from "express";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Helper function to call Gemini API
const callGeminiAPI = async (prompt) => {
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  
  if (!GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY not configured");
  }

  // Using gemini-2.5-flash model as suggested
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GOOGLE_API_KEY}`;

  const response = await fetch(geminiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${errorText}`);
  }

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
};

// Add a test route
router.get("/test", (req, res) => {
  console.log("Gemini suggestions test route hit");
  res.json({ message: "Gemini suggestions route is working!" });
});

// Generate persona-based suggestions (without enhancing existing content)
router.post("/", async (req, res) => {
  try {
    console.log("Received request to /api/gemini-suggestions");
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    
    const { userType, resumeData } = req.body;

    // Validate input
    if (!userType || !resumeData) {
      console.log("Missing userType or resumeData");
      return res.status(400).json({ error: "userType and resumeData are required" });
    }

    // Create prompt based on user type - focused only on role-based suggestions
    const createPrompt = (type) => {
      const basePrompt = `
      You are an expert AI Resume Consultant that provides role-specific resume suggestions.
      
      User Role: ${type}
      
      🎯 Task:
      Based solely on the user's role, provide general resume suggestions that would be helpful for someone in their profession.
      Do NOT enhance or modify the user's existing resume content.
      Focus ONLY on providing suggestions that are typical for their role.
      
      Return a JSON object in the following structure:
      {
        "summarySuggestion": "A 2–3 line professional summary template suitable for their role.",
        "recommendedSkills": [
          "skill1", "skill2", ...
        ],
        "recommendedSections": [
          "Section1", "Section2", ...
        ]
      }
      
      💡 Instructions:
      1. Adapt suggestions based on the userType:
         - Researcher → Focus on Publications, Research Projects, Grants, Conferences.
         - Coder → Focus on Technical Skills, Projects, GitHub Contributions, Problem Solving.
         - Student → Emphasize Education, Internships, Projects, Achievements.
         - Designer → Focus on Portfolio, Tools, Projects, Creativity.
         - Other → Provide balanced suggestions.
      2. Keep all recommendations general and role-appropriate.
      3. Do not include any markdown or formatting symbols.
      4. Always output valid JSON only.
      5. Do NOT attempt to improve or enhance the user's existing resume content.
      6. IMPORTANT: Do NOT include "enhancedBullets" in your response at all.
      7. IMPORTANT: Only return the three fields specified above: summarySuggestion, recommendedSkills, and recommendedSections.
      `;

      return basePrompt;
    };

    const prompt = createPrompt(userType);
    console.log("Sending prompt to Gemini API:", prompt.substring(0, 200) + "...");
    
    const resultText = await callGeminiAPI(prompt);
    console.log("Received response from Gemini API:", resultText.substring(0, 200) + "...");

    // Try to parse the result as JSON
    try {
      const result = JSON.parse(resultText);
      console.log("Successfully parsed JSON response");
      
      // Ensure we only return the fields we want, even if the AI returns extra fields
      const filteredResult = {
        summarySuggestion: result.summarySuggestion || "",
        recommendedSkills: Array.isArray(result.recommendedSkills) ? result.recommendedSkills : [],
        recommendedSections: Array.isArray(result.recommendedSections) ? result.recommendedSections : []
      };
      
      // Remove any undefined or null values
      Object.keys(filteredResult).forEach(key => {
        if (filteredResult[key] === undefined || filteredResult[key] === null) {
          delete filteredResult[key];
        }
      });
      
      res.json(filteredResult);
    } catch (parseError) {
      // If parsing fails, return a structured response
      console.error("Failed to parse Gemini response as JSON:", resultText);
      res.status(500).json({ 
        error: "Failed to generate suggestions",
        details: resultText 
      });
    }
  } catch (error) {
    console.error("Error in gemini-suggestions:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;