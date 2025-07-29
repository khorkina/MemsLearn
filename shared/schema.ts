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
