import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // AirMems is a client-side only application
  // All data storage uses IndexedDB
  // OpenAI proxy endpoint to handle CORS and API keys
  
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "AirMems API" });
  });

  // OpenAI proxy endpoint for lesson generation
  app.post("/api/generate-lesson", async (req, res) => {
    try {
      const { memeTitle, memeUrl, level, memeId } = req.body;
      
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: "OpenAI API key not configured" });
      }

      const OpenAI = await import("openai");
      const openai = new OpenAI.default({ 
        apiKey: process.env.OPENAI_API_KEY 
      });

      const prompt = `You are an expert English teacher who creates vocabulary-focused language lessons using memes from Reddit.

The student is learning English at the ${level.toUpperCase()} level.

Analyze this meme image and its text: "${memeTitle}"

Generate a vocabulary-focused English learning lesson based on both the visual content and text of the meme in the following JSON structure:

{
  "vocabulary": [
    {
      "word": "word or phrase from the meme",
      "definition": "clear, level-appropriate definition", 
      "example": "one example sentence using this word"
    }
  ],
  "questions": [
    {
      "id": "q1",
      "type": "multiple_choice",
      "question": "What does 'word' mean?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option B",
      "explanation": "Why this answer is correct"
    },
    {
      "id": "q2", 
      "type": "fill_in_the_gap",
      "question": "Fill in the gap: 'The cat _____ on the computer'",
      "correctAnswer": "sits",
      "explanation": "Explanation of the correct answer"
    },
    {
      "id": "q3",
      "type": "true_false", 
      "question": "True or False: This word is commonly used in everyday English.",
      "options": ["True", "False"],
      "correctAnswer": "True",
      "explanation": "Why this is true or false"
    }
  ]
}

IMPORTANT: 
- Extract 5-8 vocabulary words from both the meme image and text
- Create 8-12 interactive quiz questions (multiple choice, fill-in-the-gap, or true/false)
- Focus ONLY on vocabulary learning - no meme descriptions or cultural explanations
- Make definitions appropriate for ${level} level students
- Create diverse question types to practice the vocabulary thoroughly
- Use visual context from the image to enhance vocabulary selection

Make your explanations clear and supportive. Focus purely on vocabulary learning appropriate for the ${level} level.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are an expert English teacher. Always respond with valid JSON in the exact format requested."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              },
              {
                type: "image_url",
                image_url: {
                  url: memeUrl,
                  detail: "high"
                }
              }
            ]
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 2000,
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No content received from OpenAI");
      }

      const lessonData = JSON.parse(content);

      // Convert to our lesson format
      const lesson = {
        id: `lesson_${memeId}_${level}_${Date.now()}`,
        memeId,
        level,
        explanation: "", // No explanation/description needed
        vocabulary: lessonData.vocabulary.map((item: any) => ({
          word: item.word,
          definition: item.definition,
          example: item.example,
        })),
        questions: lessonData.questions.map((q: any) => ({
          id: q.id,
          type: q.type,
          question: q.question,
          options: q.options || [],
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
        })),
        createdAt: Date.now(),
      };

      res.json(lesson);
    } catch (error) {
      console.error("Failed to generate lesson:", error);
      res.status(500).json({ 
        error: "Failed to generate lesson. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
