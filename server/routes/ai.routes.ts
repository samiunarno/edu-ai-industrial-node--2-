import { Request, Response, Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.ts";
import OpenAI from "openai";

const router = Router();

router.post("/chat", authMiddleware, async (req: any, res: any) => {
  const { messages, userMessage, students, feedbacks } = req.body;
  
  try {
    const apiKey = process.env.ZHIPU_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing Zhipu AI API Key on server" });
    }

    const ai = new OpenAI({
      apiKey: apiKey,
      baseURL: "https://open.bigmodel.cn/api/paas/v4/"
    });
    
    const contextPrompt = `
      You are an expert educational analyst. You have access to the following class data:
      Students: ${JSON.stringify(students)}
      Recent AI Insights: ${JSON.stringify(feedbacks)}

      The user is a teacher. Answer their questions based on this data. 
      Professional, actionable, and concise advice.
    `;

    const chatHistory = messages
      .filter((m: any) => m.content !== "Hello Teacher! I'm your AI class analyst. How can I help you today?")
      .map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      }));

    const result = await ai.chat.completions.create({
      model: "glm-4-flash",
      messages: [
        { role: 'system', content: contextPrompt },
        ...chatHistory,
        { role: 'user', content: userMessage }
      ]
    });

    const responseText = result.choices[0]?.message.content || "No response text available";
    res.json({ text: responseText });
  } catch (error: any) {
    console.error("AI Chat Server Error:", error);
    res.status(500).json({ error: error.message || "AI Analysis failed" });
  }
});

export default router;
