import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not defined. AI features might not work.");
}

export const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export const MODELS = {
  flash: "gemini-3-flash-preview",
  pro: "gemini-3.1-pro-preview",
};

export async function askGemini(prompt: string, systemInstruction?: string, model: string = MODELS.flash) {
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
}

export async function analyzeFoodImage(base64Image: string, mimeType: string = "image/jpeg") {
  try {
    const response = await ai.models.generateContent({
      model: MODELS.flash,
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType } },
          { text: "Analyze this food image. Identify the food items, estimate calories, and breakdown nutrients (protein, carbs, fats). Provide the output in JSON format with fields: foodName, calories, protein, carbs, fats, vitamins, minerals, and a short 1-sentence health impact." }
        ]
      },
      config: {
         responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return null;
  }
}

