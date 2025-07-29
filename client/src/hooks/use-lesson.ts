import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { generateLesson } from "@/lib/openai-api";
import { indexedDBService } from "@/lib/indexeddb";
import { EnglishLevel, Lesson, UserProgress, Meme } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useLesson(meme: Meme | null) {
  const [selectedLevel, setSelectedLevel] = useState<EnglishLevel | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // Generate lesson mutation
  const generateLessonMutation = useMutation({
    mutationFn: async ({ level }: { level: EnglishLevel }) => {
      if (!meme) throw new Error("No meme selected");
      
      const lesson = await generateLesson(meme.title, meme.url, level, meme.id);
      
      // Save lesson to IndexedDB
      await indexedDBService.saveLesson(lesson);
      
      return lesson;
    },
    onSuccess: () => {
      toast({
        title: "Lesson Generated!",
        description: "Your personalized lesson is ready.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate lesson",
        variant: "destructive",
      });
    },
  });

  // Save user progress mutation
  const saveProgressMutation = useMutation({
    mutationFn: async (progress: UserProgress) => {
      await indexedDBService.saveUserProgress(progress);
    },
    onSuccess: () => {
      toast({
        title: "Progress Saved",
        description: "Your answers have been recorded.",
      });
    },
  });

  // Save lesson to favorites mutation
  const saveLessonMutation = useMutation({
    mutationFn: async (lessonId: string) => {
      await indexedDBService.saveLesson_favorite(lessonId);
    },
    onSuccess: () => {
      toast({
        title: "Lesson Saved",
        description: "Added to your saved lessons.",
      });
    },
  });

  const selectLevel = (level: EnglishLevel) => {
    setSelectedLevel(level);
    generateLessonMutation.mutate({ level });
  };

  const updateAnswer = (questionId: string, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const submitAnswers = (lesson: Lesson) => {
    if (!lesson) return;

    // Calculate score
    let correctAnswers = 0;
    const totalQuestions = lesson.questions.length;

    lesson.questions.forEach(question => {
      const userAnswer = userAnswers[question.id];
      if (userAnswer === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);

    const progress: UserProgress = {
      lessonId: lesson.id,
      answers: userAnswers,
      score,
      completedAt: Date.now(),
    };

    saveProgressMutation.mutate(progress);

    return {
      score,
      correctAnswers,
      totalQuestions,
      results: lesson.questions.map(question => ({
        questionId: question.id,
        userAnswer: userAnswers[question.id],
        correctAnswer: question.correctAnswer,
        isCorrect: userAnswers[question.id] === question.correctAnswer,
        explanation: question.explanation,
      })),
    };
  };

  const saveLesson = (lessonId: string) => {
    saveLessonMutation.mutate(lessonId);
  };

  return {
    selectedLevel,
    lesson: generateLessonMutation.data,
    isGenerating: generateLessonMutation.isPending,
    userAnswers,
    selectLevel,
    updateAnswer,
    submitAnswers,
    saveLesson,
    isLoading: generateLessonMutation.isPending || saveProgressMutation.isPending,
  };
}
