import OpenAI from "openai";

const zhipuApiKey = process.env.ZHIPU_API_KEY;

let zhipuAi: OpenAI | null = null;
if (zhipuApiKey) {
  zhipuAi = new OpenAI({
    apiKey: zhipuApiKey,
    baseURL: "https://open.bigmodel.cn/api/paas/v4/"
  });
}

export const generateFeedback = async (studentData: any) => {
  if (!zhipuAi) {
    console.error("Zhipu AI API Key not set. AI Integrations are disabled.");
    throw new Error("Missing ZHIPU_API_KEY for AI insight generation. Please configure it in your environment.");
  }
  
  try {
    const prompt = `Analyze this student's data and provide a detailed, smart, yet concise feedback. Point out specific areas where the student struggled or succeeded based on marks, and provide suggestions.
    Course: ${studentData.course}
    Marks: ${studentData.marks}/100
    Context: The teacher uploaded data and wants AI to analyze the grade and provide actionable insight for the student.`;
    
    const completion = await zhipuAi.chat.completions.create({
        model: "glm-4-flash",
        messages: [
            { role: "system", content: "You are an intelligent educational AI assistant." },
            { role: "user", content: prompt }
        ],
        temperature: 0.7,
    });
    return completion.choices[0]?.message.content?.trim() || "Great progress, keep up the good work.";
  } catch (error) {
    console.error("AI Generation failed:", error);
    throw new Error("Failed to generate AI insights.");
  }
};

export const evaluateFeedback = async (testData: string) => {
  if (!zhipuAi) {
    console.error("Zhipu AI API Key not set. AI Integrations are disabled.");
    throw new Error("Missing ZHIPU_API_KEY for AI evaluation. Please configure it in your environment.");
  }
  
  try {
    const prompt = `Act as an educational AI assistant/trainer evaluating data. Given the following student test data/context, generate constructive feedback.\n\nContext:\n${testData}`;
    
    const completion = await zhipuAi.chat.completions.create({
        model: "glm-4-flash",
        messages: [
            { role: "system", content: "You are an AI Trainer evaluating semantic output." },
            { role: "user", content: prompt }
        ]
    });
    return completion.choices[0]?.message.content?.trim() || "No feedback generated.";
  } catch (error) {
    console.error("AI Evaluation failed:", error);
    throw new Error("Failed to evaluate model output.");
  }
};

