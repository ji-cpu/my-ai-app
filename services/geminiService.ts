
import { GoogleGenAI, Type } from "@google/genai";
import { ACMode, ACState } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getSmartRecommendation(userInput: string, currentState: ACState) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `当前空调状态: ${JSON.stringify(currentState)}。用户需求: "${userInput}"。
      请根据用户需求，推荐最佳的模式(Mode)和温度(Temperature)。
      格力品悦系列支持模式：自动、制冷、除湿、送风、制热。温度范围16-30度。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedMode: { type: Type.STRING, description: "推荐的模式" },
            recommendedTemp: { type: Type.NUMBER, description: "推荐的温度" },
            explanation: { type: Type.STRING, description: "推荐理由，简洁有力" }
          },
          required: ["recommendedMode", "recommendedTemp", "explanation"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    return null;
  }
}
