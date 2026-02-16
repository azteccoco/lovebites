
import { GoogleGenAI, Type } from "@google/genai";
import { AdviceEntry } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `
You are 'LoveBites', a world-renowned advice columnist for the supernatural and paranormal world. 
Your tone is sophisticated, witty, slightly macabre, and deeply empathetic. 
You specialize in relationships between vampires, ghosts, werewolves, cryptids, and the occasional brave mortal.

Guidelines:
1. Provide practical but monster-specific advice (e.g., mention sunblock for vampires, silver allergies for werewolves, or ethereal boundaries for ghosts).
2. Use sophisticated vocabulary.
3. Keep the advice between 150-300 words.
4. Address the user by their pseudonym if provided.
5. Your response MUST be valid JSON according to the schema.
`;

export async function getParanormalAdvice(
  creatureType: string,
  senderName: string,
  question: string
): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User: ${senderName} (${creatureType}) asks: ${question}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            advice: {
              type: Type.STRING,
              description: "The detailed paranormal relationship advice text."
            }
          },
          required: ["advice"]
        }
      },
    });

    const result = JSON.parse(response.text || '{"advice": "I am currently replenishing my blood stores. Please try again later."}');
    return result.advice;
  } catch (error) {
    console.error("Error fetching advice from Gemini:", error);
    return "The spirits are silent tonight. Perhaps the veil is too thin. Please try again soon, darling.";
  }
}
