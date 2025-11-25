import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini Client
// The API key is injected via process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a detailed startup opportunity analysis using the Thinking model.
 * Uses gemini-3-pro-preview with a high thinking budget for deep reasoning.
 */
export const generateStartupOpportunity = async (industry: string, department: string) => {
  try {
    const prompt = `
      Act as a visionary venture capitalist and product strategist.
      Analyze the intersection of the **${industry}** industry and the **${department}** function.
      
      Identify a specific job function in this intersection that is currently:
      1. High-cost
      2. Manual
      3. Slow
      
      Propose a "Service-as-Software" agent that could automate this.
      
      Return a JSON object with the following structure:
      {
        "opportunityTitle": "Name of the startup concept",
        "painPoint": "Detailed description of the manual problem",
        "agentSolution": "What the AI agent does",
        "targetUser": "Who buys this?",
        "impact": "Efficiency gains or cost savings",
        "whyNow": "Why is this possible now (GenAI context)"
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            opportunityTitle: { type: Type.STRING },
            painPoint: { type: Type.STRING },
            agentSolution: { type: Type.STRING },
            targetUser: { type: Type.STRING },
            impact: { type: Type.STRING },
            whyNow: { type: Type.STRING },
          },
        },
        // Enable Thinking Mode for complex reasoning about business models
        thinkingConfig: {
          thinkingBudget: 32768, 
        },
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error generating opportunity:", error);
    throw error;
  }
};

/**
 * Performs market research using Google Search Grounding.
 * Uses gemini-2.5-flash for speed and tool access.
 */
export const conductMarketResearch = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find real-world companies or recent news related to: ${query}. Summarize the competitive landscape concisely.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    return { text, sources };
  } catch (error) {
    console.error("Error conducting market research:", error);
    throw error;
  }
};

/**
 * Chat functionality for the floating chatbot.
 * Uses gemini-3-pro-preview for high-quality conversation.
 */
export const sendChatMessage = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
  try {
    const chat = ai.chats.create({
      model: "gemini-3-pro-preview",
      history: history,
      config: {
        systemInstruction: "You are an expert startup consultant helping the user refine their Service-as-Software ideas.",
      }
    });
    
    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Chat error:", error);
    throw error;
  }
}
