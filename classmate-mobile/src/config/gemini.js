// src/config/gemini.js
const API_KEY = "AIzaSyAQBrgjozL56oAmbqfP3Qfd-LzR0fJfs8U";

export const getGeminiResponse = async (prompt) => {
  if (!API_KEY) return "Error: API Key is missing.";

  const models = ["gemini-2.0-flash", "gemini-1.5-flash"];

  for (const modelName of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });

      const data = await response.json();

      if (data.candidates && data.candidates.length > 0) {
        return data.candidates[0].content.parts[0].text;
      }

      if (data.error && data.error.message.includes("not found")) {
        console.log(`Model ${modelName} failed, trying next...`);
        continue;
      }

      if (data.error && data.error.message.includes("429")) {
        return "AI Limit Reached (Quota Exceeded). Please try again later.";
      }
    } catch (e) {
      console.error(e);
    }
  }

  return "I am currently offline or busy. Please try again later.";
};
