import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import { indexedDBService } from "@/lib/indexeddb";
import { useLesson } from "@/hooks/use-lesson";
import { useMemeExplanation } from "@/hooks/use-meme-explanation";
import { LanguageSelector } from "@/components/language-selector";
import { MemeExplanationDisplay } from "@/components/meme-explanation";
import { LevelSelector } from "@/components/level-selector";
import { LessonContent } from "@/components/lesson-content";
import { Meme, SupportedLanguage } from "@shared/schema";

export default function Lesson() {
  const { memeId } = useParams<{ memeId: string }>();
  const [, setLocation] = useLocation();
  const [meme, setMeme] = useState<Meme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'explanation' | 'level' | 'lesson'>('explanation');

  const {
    selectedLevel,
    lesson,
    isGenerating,
    selectLevel,
    saveLesson,
  } = useLesson(meme);

  const {
    explanation,
    isGenerating: isGeneratingExplanation,
    generateExplanation,
  } = useMemeExplanation(meme);

  useEffect(() => {
    const loadMeme = async () => {
      if (!memeId) {
        setError("No meme ID provided");
        setLoading(false);
        return;
      }

      try {
        await indexedDBService.init();
        const foundMeme = await indexedDBService.getMeme(memeId);
        
        if (!foundMeme) {
          setError("Meme not found. Please go back and select a meme from the feed.");
        } else {
          setMeme(foundMeme);
        }
      } catch (err) {
        setError("Failed to load meme. Please try again.");
        console.error("Error loading meme:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMeme();
  }, [memeId]);

  const handleBackToFeed = () => {
    setLocation("/");
  };

  const handleSaveLesson = () => {
    if (lesson) {
      saveLesson(lesson.id);
    }
  };

  const handleLanguageSelect = (language: SupportedLanguage) => {
    generateExplanation(language);
  };

  const handleSkipExplanation = () => {
    setCurrentStep('level');
  };

  const handleContinueToLevel = () => {
    setCurrentStep('level');
  };

  // When explanation is generated, move to explanation display
  useEffect(() => {
    if (explanation) {
      setCurrentStep('explanation');
    }
  }, [explanation]);

  // When level is selected, generate lesson and move to lesson step
  useEffect(() => {
    if (selectedLevel) {
      setCurrentStep('lesson');
    }
  }, [selectedLevel]);

  // When lesson is generated, ensure we stay on lesson step
  useEffect(() => {
    if (lesson) {
      setCurrentStep('lesson');
    }
  }, [lesson]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (error || !meme) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Oops! Something went wrong
              </h2>
              <p className="text-gray-600 mb-6">
                {error || "Meme not found"}
              </p>
              <Button onClick={handleBackToFeed} className="bg-primary hover:bg-primary/90">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Feed
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lesson-fade-in">
          <Button
            variant="ghost"
            onClick={handleBackToFeed}
            className="mb-6 text-primary hover:text-primary/80"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Feed
          </Button>

          {/* Meme Display */}
          <Card className="shadow-lg overflow-hidden mb-8">
            <div className="flex justify-center bg-gray-100 dark:bg-gray-800">
              <img
                src={meme.url}
                alt={meme.title}
                className="max-w-full max-h-96 object-contain"
              />
            </div>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
                {meme.title}
              </h2>
              <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                <span>{meme.subreddit}</span>
                <a
                  href={meme.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View Original Post
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Step 1: Language Selection for Explanation */}
          {currentStep === 'explanation' && !explanation && !isGeneratingExplanation && (
            <LanguageSelector
              onSelectLanguage={handleLanguageSelect}
              selectedLanguage={null}
              onSkip={handleSkipExplanation}
              isLoading={isGeneratingExplanation}
            />
          )}

          {/* Explanation Loading */}
          {isGeneratingExplanation && (
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-primary mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Генерирую объяснение мема...
                  </h3>
                  <p className="text-gray-600">Анализирую изображение и контекст</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Display Explanation */}
          {explanation && currentStep === 'explanation' && (
            <MemeExplanationDisplay
              explanation={explanation}
              onContinue={handleContinueToLevel}
            />
          )}

          {/* Step 3: Level Selection */}
          {currentStep === 'level' && !selectedLevel && (
            <LevelSelector
              onSelectLevel={selectLevel}
              selectedLevel={selectedLevel}
              isLoading={isGenerating}
            />
          )}

          {/* Lesson Loading */}
          {selectedLevel && isGenerating && currentStep === 'lesson' && (
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-primary mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Generating your personalized lesson...
                  </h3>
                  <p className="text-gray-600">This may take a few seconds</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Generated Lesson Content */}
          {lesson && meme && !isGenerating && currentStep === 'lesson' && (
            <LessonContent
              lesson={lesson}
              meme={meme}
              onSaveLesson={handleSaveLesson}
              onBackToFeed={handleBackToFeed}
            />
          )}
        </div>
      </div>
    </div>
  );
}