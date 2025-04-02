import { GoogleGenAI } from "@google/genai";
import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";

//initialize the gemini api with your api key
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const generateSummaryFromGemini = async (pdfText: string) => {
  try {
    const cleanedPdfText = pdfText.replace(/\s{2,}/g, " ").trim();

    const prompt = `${SUMMARY_SYSTEM_PROMPT}\n\nTransform this document into an engaging, easy-to-read summary with contextually relevant emojis and proper markdown formatting:\n\n${cleanedPdfText}`;

    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        temperature: 0.7,
        maxOutputTokens: 1500,
      },
    });

    if (!result.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Empty response from Gemini API");
    }

    console.log(result.candidates?.[0]?.content?.parts?.[0]?.text);
    return result.candidates[0].content.parts[0].text;
  } catch (error: any) {
    console.error("Gemini API error:", error);
    throw error;
  }
};
