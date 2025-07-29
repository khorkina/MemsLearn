import { z } from "zod";

// Meme data structure
export const memeSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string(),
  subreddit: z.string(),
  permalink: z.string(),
  upvotes: z.number(),
  author: z.string(),
  created: z.number(),
});

export type Meme = z.infer<typeof memeSchema>;

// English learning levels
export const englishLevelSchema = z.enum(["beginner", "intermediate", "advanced"]);
export type EnglishLevel = z.infer<typeof englishLevelSchema>;

// Supported languages for meme explanation
export const supportedLanguageSchema = z.enum([
  "english", "russian", "spanish", "french", "german", "italian", 
  "portuguese", "chinese", "japanese", "korean", "arabic", "hindi",
  "turkish", "polish", "dutch", "swedish", "norwegian", "danish",
  "finnish", "czech"
]);
export type SupportedLanguage = z.infer<typeof supportedLanguageSchema>;

export const languageOptions = [
  { code: "english", name: "English", nativeName: "English" },
  { code: "russian", name: "Russian", nativeName: "Русский" },
  { code: "spanish", name: "Spanish", nativeName: "Español" },
  { code: "french", name: "French", nativeName: "Français" },
  { code: "german", name: "German", nativeName: "Deutsch" },
  { code: "italian", name: "Italian", nativeName: "Italiano" },
  { code: "portuguese", name: "Portuguese", nativeName: "Português" },
  { code: "chinese", name: "Chinese", nativeName: "中文" },
  { code: "japanese", name: "Japanese", nativeName: "日本語" },
  { code: "korean", name: "Korean", nativeName: "한국어" },
  { code: "arabic", name: "Arabic", nativeName: "العربية" },
  { code: "hindi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "turkish", name: "Turkish", nativeName: "Türkçe" },
  { code: "polish", name: "Polish", nativeName: "Polski" },
  { code: "dutch", name: "Dutch", nativeName: "Nederlands" },
  { code: "swedish", name: "Swedish", nativeName: "Svenska" },
  { code: "norwegian", name: "Norwegian", nativeName: "Norsk" },
  { code: "danish", name: "Danish", nativeName: "Dansk" },
  { code: "finnish", name: "Finnish", nativeName: "Suomi" },
  { code: "czech", name: "Czech", nativeName: "Čeština" },
] as const;

// Meme explanation structure
export const memeExplanationSchema = z.object({
  id: z.string(),
  memeId: z.string(),
  language: supportedLanguageSchema,
  explanation: z.string(),
  culturalContext: z.string().optional(),
  createdAt: z.number(),
});

export type MemeExplanation = z.infer<typeof memeExplanationSchema>;

// Vocabulary item
export const vocabularyItemSchema = z.object({
  word: z.string(),
  definition: z.string(),
  example: z.string(),
});

export type VocabularyItem = z.infer<typeof vocabularyItemSchema>;

// Quiz question types
export const quizQuestionSchema = z.object({
  id: z.string(),
  type: z.enum(["multiple_choice", "fill_in_the_gap", "true_false"]),
  question: z.string(),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string(),
  explanation: z.string(),
});

export type QuizQuestion = z.infer<typeof quizQuestionSchema>;

// Lesson content structure
export const lessonSchema = z.object({
  id: z.string(),
  memeId: z.string(),
  level: englishLevelSchema,
  explanation: z.string(),
  vocabulary: z.array(vocabularyItemSchema),
  questions: z.array(quizQuestionSchema),
  createdAt: z.number(),
});

export type Lesson = z.infer<typeof lessonSchema>;

// User progress tracking
export const userProgressSchema = z.object({
  lessonId: z.string(),
  answers: z.record(z.string()),
  score: z.number(),
  completedAt: z.number(),
});

export type UserProgress = z.infer<typeof userProgressSchema>;

// Saved lesson
export const savedLessonSchema = z.object({
  lessonId: z.string(),
  savedAt: z.number(),
});

export type SavedLesson = z.infer<typeof savedLessonSchema>;
