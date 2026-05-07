import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not defined. AI features might not work.");
}

export const ai = new GoogleGenAI({ apiKey: apiKey || "" });

function cleanJson(text: string) {
  try {
    // Try to find the first '{' or '[' and last '}' or ']'
    const startObj = text.indexOf('{');
    const startArr = text.indexOf('[');
    let start = -1;
    if (startObj !== -1 && startArr !== -1) start = Math.min(startObj, startArr);
    else if (startObj !== -1) start = startObj;
    else if (startArr !== -1) start = startArr;

    const endObj = text.lastIndexOf('}');
    const endArr = text.lastIndexOf(']');
    let end = -1;
    if (endObj !== -1 && endArr !== -1) end = Math.max(endObj, endArr);
    else if (endObj !== -1) end = endObj;
    else if (endArr !== -1) end = endArr;

    if (start === -1 || end === -1) {
      // Fallback to simple parse
      return JSON.parse(text.trim());
    }

    const cleaned = text.substring(start, end + 1);
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("JSON Parse Error:", e, "Original text:", text);
    return null;
  }
}

export const MODELS = {
  flash: "gemini-3-flash-preview",
  pro: "gemini-3.1-pro-preview",
};

export async function askGemini(prompt: string, systemInstruction?: string, model: string = MODELS.flash) {
  if (!apiKey) {
    console.error("Gemini API Key is missing. Please set GEMINI_API_KEY in your environment.");
    return null;
  }
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });
    return cleanJson(response.text || "{}");
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
}

export async function analyzeFoodImage(base64Image: string, mimeType: string = "image/jpeg") {
  if (!apiKey) {
    console.error("Gemini API Key is missing. Please set GEMINI_API_KEY in your environment.");
    return null;
  }
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
    return cleanJson(response.text || "{}");
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return null;
  }
}

