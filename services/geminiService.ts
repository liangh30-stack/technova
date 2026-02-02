import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const chatWithAssistant = async (userMessage: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: `You are TechBot, a helpful assistant for "TechNova", a mobile repair and accessories shop.
        
        Our services:
        1. Professional Repairs (Screens, Batteries, Logic Boards).
        2. Premium Accessories (Cases, Screen Protectors).
        3. Real-time Status Lookup.

        Tone: Professional, Tech-savvy, slightly witty.
        If a user asks about repair status, guide them to the 'Repair Lookup' page.
        If a user asks about products, recommend our high-quality cases.
        Keep answers concise (under 50 words unless detailed explanation is needed).
        `
      }
    });

    return response.text || "I didn't catch that. Could you rephrase?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm currently offline. Please try again later.";
  }
};

export const chatWithThinking = async (userMessage: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: userMessage,
      config: {
        thinkingConfig: { thinkingBudget: 2048 },
        systemInstruction: "You are a senior technical expert. Think step-by-step to solve complex diagnostic problems for mobile devices."
      }
    });
    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Thinking Error:", error);
    return "I couldn't complete the deep analysis.";
  }
};

export const analyzeImage = async (base64Image: string, prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: prompt || "Analyze this image for damage." }
        ]
      }
    });
    return response.text || "No insights found.";
  } catch (error) {
    console.error("Vision Error:", error);
    return "I couldn't analyze the image.";
  }
};