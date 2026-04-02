require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { generateText } = require("ai");
const { googleAi } = require("./config/gemini");

const app = express();

app.use(cors());
app.use(express.json());

console.log("KEY LOADED:", process.env.GEMINI_API_KEY ? "YES" : "NO");

app.get("/", (req, res) => {
  res.send("CivilPlan AI backend running 🚀");
});

app.post("/api/generate-plan", async (req, res) => {
  try {
    const { plotSize, bedrooms, bathrooms, floors, features, notes } = req.body;

    const prompt = `
You are an AI assistant helping civil engineers create a simple conceptual floor plan.

Based on the user input below, generate a professional and well-structured response.

User Input:
- Plot Size: ${plotSize}
- Bedrooms: ${bedrooms}
- Bathrooms: ${bathrooms}
- Floors: ${floors}
- Features: ${features?.join(", ")}
- Notes: ${notes}

Return the response with these headings:

Project Summary
Suggested Room Layout
Suggested Room Dimensions
Structural / Design Notes
Disclaimer

Keep the response clear, practical, and professional.
Do not use markdown symbols like ** or ##.
`;

    const { text } = await generateText({
      model: googleAi("gemini-2.5-flash"),
      prompt,
    });

    res.json({
      success: true,
      result: text.trim(),
    });
  } catch (error) {
    console.error("Generate plan error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate plan",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 4009;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});