import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Book, Bookmark, ArrowLeft } from "lucide-react";
import { Lesson, Meme } from "@shared/schema";
import { InteractiveQuiz } from "@/components/interactive-quiz";

interface LessonContentProps {
  lesson: Lesson;
  meme: Meme;
  onSaveLesson: () => void;
  onBackToFeed: () => void;
}

export function LessonContent({ lesson, meme, onSaveLesson, onBackToFeed }: LessonContentProps) {
  return (
    <div className="lesson-fade-in">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={onBackToFeed}
        className="mb-6 text-primary hover:text-primary/80"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Feed
      </Button>

      {/* Meme Display */}
      <Card className="shadow-lg overflow-hidden mb-8">
        <img
          src={meme.url}
          alt={meme.title}
          className="w-full h-96 object-cover"
        />
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            {meme.title}
          </h2>
          <div className="flex items-center justify-between text-gray-600">
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

      {/* Meme Explanation */}
      <Card className="shadow-lg mb-6">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-primary mb-4 flex items-center">
            <Lightbulb className="w-6 h-6 mr-3" />
            Meme Explanation
          </h3>
          <div className="prose text-gray-700">
            <p>{lesson.explanation}</p>
          </div>
        </CardContent>
      </Card>

      {/* Vocabulary Section */}
      <Card className="shadow-lg mb-6">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-primary mb-4 flex items-center">
            <Book className="w-6 h-6 mr-3" />
            Vocabulary & Idioms
          </h3>
          <div className="space-y-4">
            {lesson.vocabulary.map((item, index) => (
              <div key={index} className="border-l-4 border-accent pl-4">
                <h4 className="font-medium text-gray-800">{item.word}</h4>
                <p className="text-gray-600 text-sm">{item.definition}</p>
                <p className="text-sm text-gray-600 italic mt-1">
                  Example: "{item.example}"
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interactive Quiz */}
      <InteractiveQuiz lesson={lesson} />

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <Button
          onClick={onSaveLesson}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <Bookmark className="w-4 h-4 mr-2" />
          Save This Lesson
        </Button>
        <Button
          variant="outline"
          onClick={onBackToFeed}
          className="border-primary text-primary hover:bg-accent"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Memes
        </Button>
      </div>
    </div>
  );
}