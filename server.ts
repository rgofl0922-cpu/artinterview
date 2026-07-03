import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { ARTISTS } from "./src/artists.ts";
import dotenv from "dotenv";

dotenv.config();

// Shared Gemini API client utility initialized server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoints FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Fetch list of artists
  app.get("/api/artists", (req, res) => {
    // Return lightweight artist info (without heavy prompt details if not needed, but sending full is fine)
    res.json(ARTISTS.map(a => ({
      id: a.id,
      name: a.name,
      englishName: a.englishName,
      years: a.years,
      era: a.era,
      values: a.values,
      expression: a.expression,
      works: a.works,
      avatarColor: a.avatarColor,
      bgGradient: a.bgGradient,
      borderColor: a.borderColor,
      textColor: a.textColor,
      greeting: a.greeting,
      suggestedQuestions: a.suggestedQuestions
    })));
  });

  // Securly proxy Gemini chat requests
  app.post("/api/chat", async (req, res) => {
    try {
      const { artistId, messages } = req.body;

      const artist = ARTISTS.find(a => a.id === artistId);
      if (!artist) {
        return res.status(404).json({ error: "작가를 찾을 수 없습니다." });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ 
          error: "API 키가 구성되지 않았습니다. AI Studio Secrets 패널에서 GEMINI_API_KEY를 설정해 주세요." 
        });
      }

      // Convert messages for @google/genai SDK
      // Roles must be 'user' or 'model'
      const contents = messages
        .filter((msg: any) => msg.role === 'user' || msg.role === 'assistant')
        .map((msg: any) => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }));

      if (contents.length === 0) {
        return res.status(400).json({ error: "메시지가 비어 있습니다." });
      }

      const enhancedSystemInstruction = `${artist.systemPrompt}\n\n[★매우 중요 추가 지침★]\n1. 한 번에 가치관(생각)과 표현 방법(기법)을 한꺼번에 장황하게 다 알려주지 마세요. 사용자가 물어보지 않은 내용까지 미리 전부 답변해 버리면, 어린이가 활동지를 직접 채워나가는 재미와 탐구 기회를 잃게 됩니다. 오직 사용자가 던진 구체적인 질문에 집중하여 '그 질문에 대한 답'만 명확하게 반응해 주세요.\n2. 당신은 상담 봇이 아닙니다. 사용자의 마음 상태나 감정, 느낌을 되묻는 심리 치료형 꼬리 질문(예: "너는 어떤 기분이 드니?", "네 생각이나 감정은 어때?")은 절대로 던지지 마세요. 오직 작가 본인으로서 작품의 정보, 미술 기법, 시대 배경 등 탐구자가 기본 정보를 명확하게 조사할 수 있는 지식 중심의 친절한 답변을 전해 주세요.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: enhancedSystemInstruction,
          temperature: 0.7,
        }
      });

      const text = response.text || "대답을 생성하지 못했어요. 다시 한 번 질문해 줄래?";
      res.json({ text });
    } catch (error: any) {
      console.error("Gemini API Proxy Error:", error);
      res.status(500).json({ error: error?.message || "인터넷 연결을 확인하고 다시 시도해 주세요." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
