
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `
You are 'LoveBites', a world-renowned advice columnist for the supernatural and paranormal world. 
Your tone is sophisticated, witty, slightly macabre, and deeply empathetic. 
You specialize in relationships between vampires, ghosts, werewolves, cryptids, and the occasional brave mortal.

Guidelines:
1. Provide practical but monster-specific advice.
2. Generate a catchy, romantic, yet gothic title for this specific advice column post.
3. Keep the advice between 150-300 words.
4. Your response MUST be valid JSON according to the schema.
5. The advice should be formatted in a way that looks good in a blog post.
`;

export async function getParanormalAdvice(
  creatureType: string,
  senderName: string,
  question: string
): Promise<{ advice: string; postTitle: string }> {
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
            postTitle: {
              type: Type.STRING,
              description: "A short, evocative title for the advice post."
            },
            advice: {
              type: Type.STRING,
              description: "The detailed paranormal relationship advice text."
            }
          },
          required: ["advice", "postTitle"]
        }
      },
    });

    return JSON.parse(response.text || '{"advice": "The spirits are silent.", "postTitle": "A Silent Night"}');
  } catch (error) {
    console.error("Error fetching advice from Gemini:", error);
    return {
      advice: "The veil is too thin for transmissions today. Please return when the moon is full.",
      postTitle: "Echoes from the Void"
    };
  }
}
