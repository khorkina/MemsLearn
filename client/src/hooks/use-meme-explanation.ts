import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { MemeExplanation, SupportedLanguage, Meme } from "@shared/schema";
import { indexedDBService } from "@/lib/indexeddb";

export function useMemeExplanation(meme: Meme | null) {
  const [explanation, setExplanation] = useState<MemeExplanation | null>(null);

  const generateExplanationMutation = useMutation({
    mutationFn: async (language: SupportedLanguage) => {
      if (!meme) throw new Error("No meme provided");
      
      const response = await apiRequest("POST", "/api/explain-meme", {
        memeId: meme.id,
        memeTitle: meme.title,
        memeUrl: meme.url,
        language,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate explanation");
      }

      const explanationData: MemeExplanation = await response.json();
      
      // Save explanation to IndexedDB for caching
      try {
        await indexedDBService.init();
        await indexedDBService.saveExplanation(explanationData);
      } catch (err) {
        console.warn("Failed to cache explanation:", err);
      }

      return explanationData;
    },
    onSuccess: (data) => {
      setExplanation(data);
    },
    onError: (error) => {
      console.error("Failed to generate explanation:", error);
    },
  });

  const generateExplanation = (language: SupportedLanguage) => {
    generateExplanationMutation.mutate(language);
  };

  const clearExplanation = () => {
    setExplanation(null);
  };

  return {
    explanation,
    isGenerating: generateExplanationMutation.isPending,
    error: generateExplanationMutation.error,
    generateExplanation,
    clearExplanation,
  };
}