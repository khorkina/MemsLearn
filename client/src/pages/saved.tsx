import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookMarked, Clock, ArrowRight, Trash2 } from "lucide-react";
import { Lesson } from "@shared/schema";
import { getAllLessons, deleteLesson } from "@/lib/indexeddb";
import { useToast } from "@/hooks/use-toast";

export default function Saved() {
  const [savedLessons, setSavedLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSavedLessons();
  }, []);

  const loadSavedLessons = async () => {
    try {
      const lessons = await getAllLessons();
      setSavedLessons(lessons.sort((a: Lesson, b: Lesson) => b.createdAt - a.createdAt));
    } catch (error) {
      console.error("Failed to load saved lessons:", error);
      toast({
        title: "Error",
        description: "Failed to load saved lessons",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    try {
      await deleteLesson(lessonId);
      setSavedLessons(prev => prev.filter(lesson => lesson.id !== lessonId));
      toast({
        title: "Success",
        description: "Lesson deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete lesson:", error);
      toast({
        title: "Error",
        description: "Failed to delete lesson",
        variant: "destructive",
      });
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 pb-20">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center space-x-2 mb-6">
            <BookMarked className="h-6 w-6 text-amber-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Saved Lessons
            </h1>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center space-x-2 mb-6">
          <BookMarked className="h-6 w-6 text-amber-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Saved Lessons
          </h1>
        </div>

        {savedLessons.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookMarked className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No Saved Lessons
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
                Complete lessons from memes to see them here
              </p>
              <Link href="/">
                <Button>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Browse Memes
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {savedLessons.map((lesson) => (
              <Card key={lesson.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getLevelColor(lesson.level)}>
                          {lesson.level}
                        </Badge>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(lesson.createdAt)}
                        </div>
                      </div>
                      <CardTitle className="text-lg">
                        {lesson.vocabulary.length} vocabulary words
                      </CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {lesson.questions.length} exercises
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteLesson(lesson.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {lesson.vocabulary.slice(0, 3).map((vocab, index) => (
                        <span
                          key={index}
                          className="inline-block text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 px-2 py-1 rounded"
                        >
                          {vocab.word}
                        </span>
                      ))}
                      {lesson.vocabulary.length > 3 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                          +{lesson.vocabulary.length - 3} more
                        </span>
                      )}
                    </div>
                    <Link href={`/lesson/${lesson.memeId}?saved=${lesson.id}`}>
                      <Button size="sm">
                        Review
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}