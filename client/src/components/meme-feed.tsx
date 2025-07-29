import { MemeCard } from "./meme-card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { useMemes } from "@/hooks/use-memes";
import { useLocation } from "wouter";

export function MemeFeed() {
  const { memes, isLoading, error, loadMore, refresh, hasMore } = useMemes();
  const [, setLocation] = useLocation();

  const handleMemeClick = (memeId: string) => {
    setLocation(`/lesson/${memeId}`);
  };

  if (error && memes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Unable to load memes
          </h3>
          <p className="text-gray-600">
            Please check your internet connection and try again.
          </p>
        </div>
        <Button onClick={refresh} className="bg-primary hover:bg-primary/90">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold text-primary mb-3">
          Learn English with Memes
        </h2>
        <p className="text-gray-600 text-lg">
          Click any meme to start an interactive lesson
        </p>
      </div>

      {memes.length === 0 && isLoading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading amazing memes...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {memes.map((meme) => (
              <MemeCard
                key={meme.id}
                meme={meme}
                onClick={() => handleMemeClick(meme.id)}
              />
            ))}
          </div>

          {hasMore && (
            <div className="text-center">
              <Button
                onClick={loadMore}
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  "Load More Memes"
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}