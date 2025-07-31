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

  // Meme explanation endpoint
  app.post("/api/explain-meme", async (req, res) => {
    try {
      const { memeTitle, memeUrl, language, memeId } = req.body;
      
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: "OpenAI API key not configured" });
      }

      const OpenAI = await import("openai");
      const openai = new OpenAI.default({ 
        apiKey: process.env.OPENAI_API_KEY 
      });

      // Language mapping for better prompts
      const languageNames: Record<string, string> = {
        english: "English",
        russian: "Russian (Русский)",
        spanish: "Spanish (Español)",
        french: "French (Français)",
        german: "German (Deutsch)",
        italian: "Italian (Italiano)",
        portuguese: "Portuguese (Português)",
        chinese: "Chinese (中文)",
        japanese: "Japanese (日本語)",
        korean: "Korean (한국어)",
        arabic: "Arabic (العربية)",
        hindi: "Hindi (हिन्दी)",
        turkish: "Turkish (Türkçe)",
        polish: "Polish (Polski)",
        dutch: "Dutch (Nederlands)",
        swedish: "Swedish (Svenska)",
        norwegian: "Norwegian (Norsk)",
        danish: "Danish (Dansk)",
        finnish: "Finnish (Suomi)",
        czech: "Czech (Čeština)",
      };

      const targetLanguage = languageNames[language] || "English";
      
      const prompt = `You are an expert in internet culture helping students understand online content. 

Analyze this meme image and provide a comprehensive understanding of what you see. IMPORTANT: If there is any text visible in the image (captions, words on the image, speech bubbles, etc.), make sure to read and include that text in your analysis.

Provide a clear, comprehensive explanation in ${targetLanguage} language in the following JSON structure:

{
  "explanation": "Educational explanation of what this image shows and its cultural context, including any text visible within the image",
  "culturalContext": "Any cultural background or context needed to understand this content"
}

IMPORTANT: 
- Respond ONLY in ${targetLanguage} language
- CAREFULLY READ any text that appears ON the image itself (captions, speech bubbles, text overlays)
- Analyze the visual content of the image INCLUDING any text that appears within the image itself
- If there is text visible in the image, make sure to explain what the text says and its meaning
- Focus on educational and cultural understanding of both visual elements and any readable text within the image
- Keep explanations appropriate and educational
- If there are no significant cultural elements, you can omit the culturalContext field
- Focus on language learning value

Make your explanation helpful for language students.`;

      // Validate that we have a proper image URL
      if (!memeUrl || !memeUrl.startsWith('http')) {
        throw new Error("Invalid image URL provided");
      }

      console.log(`[EXPLAIN-MEME] Processing meme image only: ${memeUrl}`);

      // Use vision API to analyze both image and text
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: `You are an expert in internet culture helping with educational content. Always respond with valid JSON in the exact format requested. Respond ONLY in ${targetLanguage} language. Focus on educational content. CRITICAL: If there is any text visible in the image (words, captions, speech bubbles), you MUST read and include that text in your response.`
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
        temperature: 0.3,
        max_tokens: 1500,
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No content received from OpenAI");
      }

      const explanationData = JSON.parse(content);

      // Convert to our explanation format
      const explanation = {
        id: `explanation_${memeId}_${language}_${Date.now()}`,
        memeId,
        language,
        explanation: explanationData.explanation,
        culturalContext: explanationData.culturalContext || undefined,
        createdAt: Date.now(),
      };

      res.json(explanation);
    } catch (error) {
      console.error("Failed to generate meme explanation:", error);
      res.status(500).json({ 
        error: "Failed to generate explanation. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
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

      const prompt = `You are an expert English teacher creating educational vocabulary lessons. 

The student is learning English at the ${level.toUpperCase()} level.

Analyze this meme image to create a comprehensive vocabulary lesson based on what you see. IMPORTANT: If there is any text visible in the image (captions, words, speech bubbles, etc.), make sure to read that text and include words from it in your vocabulary lesson.

Focus on educational vocabulary learning and generate a lesson in the following JSON structure:

{
  "vocabulary": [
    {
      "word": "word or phrase from the image (including text within the image)",
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
- CAREFULLY READ any text that appears ON the image itself (captions, speech bubbles, text overlays)
- Analyze the visual content INCLUDING any text that appears within the image itself
- Read and extract vocabulary from both visual elements (objects, actions, expressions) AND any text written on the image
- Extract 5-8 vocabulary words from what you see in the image and especially any text written on the image
- If there is readable text in the image, prioritize vocabulary from that text
- Create 8-12 educational quiz questions (multiple choice, fill-in-the-gap, or true/false)
- Focus on vocabulary learning and educational content only
- Make definitions appropriate for ${level} level students
- Create diverse question types to practice vocabulary
- Keep content educational and appropriate

Focus on vocabulary learning appropriate for the ${level} level.`;

      // Validate that we have a proper image URL
      if (!memeUrl || !memeUrl.startsWith('http')) {
        throw new Error("Invalid image URL provided");
      }

      console.log(`[GENERATE-LESSON] Processing meme image only: ${memeUrl} for ${level} level`);

      // Use vision API to analyze both image and text for comprehensive lesson generation
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are an expert English teacher creating educational vocabulary lessons. Always respond with valid JSON in the exact format requested. Focus on educational content only. CRITICAL: If there is any text visible in the image (words, captions, speech bubbles), you MUST read that text and include words from it in your vocabulary lesson."
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
        temperature: 0.3,
        max_tokens: 2000,
      });

      console.log("OpenAI response:", JSON.stringify(response, null, 2));

      const content = response.choices[0]?.message?.content;
      if (!content) {
        console.error("No content in OpenAI response:", response);
        throw new Error(`No content received from OpenAI. Response: ${JSON.stringify(response.choices[0])}`);
      }

      let lessonData;
      try {
        lessonData = JSON.parse(content);
      } catch (parseError) {
        console.error("Failed to parse OpenAI response as JSON:", content);
        throw new Error(`Invalid JSON response from OpenAI: ${parseError instanceof Error ? parseError.message : 'Unknown parsing error'}`);
      }

      // Validate required fields
      if (!lessonData.vocabulary || !Array.isArray(lessonData.vocabulary)) {
        throw new Error("OpenAI response missing vocabulary array");
      }
      if (!lessonData.questions || !Array.isArray(lessonData.questions)) {
        throw new Error("OpenAI response missing questions array");
      }

      // Convert to our lesson format
      const lesson = {
        id: `lesson_${memeId}_${level}_${Date.now()}`,
        memeId,
        level,
        explanation: "", // No explanation/description needed
        vocabulary: lessonData.vocabulary.map((item: any) => ({
          word: item.word || "",
          definition: item.definition || "",
          example: item.example || "",
        })),
        questions: lessonData.questions.map((q: any) => ({
          id: q.id || `q${Math.random()}`,
          type: q.type || "multiple_choice",
          question: q.question || "",
          options: q.options || [],
          correctAnswer: q.correctAnswer || "",
          explanation: q.explanation || "",
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
