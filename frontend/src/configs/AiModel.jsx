import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateCourseLayout_AI = async (prompt) => {
  const ai = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  console.log("Generated Course Layout:", text);
  return text;
};
