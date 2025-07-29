import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { fetchMemes } from "@/lib/reddit-api";
import { indexedDBService } from "@/lib/indexeddb";
import { Meme } from "@shared/schema";

export function useMemes() {
  const [page, setPage] = useState(0);
  const [allMemes, setAllMemes] = useState<Meme[]>([]);

  // Initialize IndexedDB
  useEffect(() => {
    indexedDBService.init().catch(console.error);
  }, []);

  const { data: newMemes, isLoading, error, refetch } = useQuery({
    queryKey: ["memes", page],
    queryFn: async () => {
      try {
        // Try to fetch from API
        const memes = await fetchMemes(page);
        
        // Save to IndexedDB for caching
        if (memes.length > 0) {
          await indexedDBService.saveMemes(memes);
        }
        
        return memes;
      } catch (error) {
        // Fallback to cached memes from IndexedDB
        console.warn("Failed to fetch new memes, using cached data:", error);
        const cachedMemes = await indexedDBService.getMemes(20, page * 20);
        return cachedMemes;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update allMemes when new memes are fetched
  useEffect(() => {
    if (newMemes) {
      if (page === 0) {
        setAllMemes(newMemes);
      } else {
        setAllMemes(prev => [...prev, ...newMemes]);
      }
    }
  }, [newMemes, page]);

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  const refresh = () => {
    setPage(0);
    setAllMemes([]);
    refetch();
  };

  return {
    memes: allMemes,
    isLoading,
    error,
    loadMore,
    refresh,
    hasMore: (newMemes?.length || 0) > 0,
  };
}
