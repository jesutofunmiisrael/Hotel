const { createGoogleGenerativeAI } = require("@ai-sdk/google");

const googleAi = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

module.exports = { googleAi };