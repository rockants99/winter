
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { PoemConfig, PoemMood } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generatePoemStream = async (
  config: PoemConfig,
  onChunk: (text: string) => void
) => {
  try {
    const prompt = `
      请创作一首赞美冬天的现代诗或古风诗。
      情感基调：${config.mood}
      篇幅长度：${config.length === 'short' ? '精简' : config.length === 'medium' ? '适中' : '长篇'}
      
      要求：
      1. 意象丰富，如白雪、寒梅、北风、炉火等。
      2. 语言优美，富有节奏感。
      3. 赞美冬天的独特魅力。
      4. 请直接输出诗歌内容，不要包含任何前言或结语。
    `;

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "你是一位精通中西方诗歌艺术的文学大师，擅长运用细腻的词汇描绘冬日的景致与情感。你的文字应当充满画面感和意境感。",
        temperature: 0.9,
        topP: 0.95,
      },
    });

    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        onChunk(text);
      }
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
