import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, BookOpen, Trophy, Calendar, Settings, Trash2 } from "lucide-react";
import { Lesson } from "@shared/schema";
import { getAllLessons, clearAllData } from "@/lib/indexeddb";
import { useToast } from "@/hooks/use-toast";

export default function Account() {
  const [stats, setStats] = useState({
    totalLessons: 0,
    beginnerLessons: 0,
    intermediateLessons: 0,
    advancedLessons: 0,
    totalVocabulary: 0,
    totalQuestions: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const lessons = await getAllLessons();
      
      const stats = lessons.reduce(
        (acc, lesson) => {
          acc.totalLessons++;
          acc.totalVocabulary += lesson.vocabulary.length;
          acc.totalQuestions += lesson.questions.length;
          
          switch (lesson.level) {
            case 'beginner':
              acc.beginnerLessons++;
              break;
            case 'intermediate':
              acc.intermediateLessons++;
              break;
            case 'advanced':
              acc.advancedLessons++;
              break;
          }
          
          return acc;
        },
        {
          totalLessons: 0,
          beginnerLessons: 0,
          intermediateLessons: 0,
          advancedLessons: 0,
          totalVocabulary: 0,
          totalQuestions: 0,
        }
      );

      setStats(stats);
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    if (!confirm("Are you sure you want to delete all saved lessons? This action cannot be undone.")) {
      return;
    }

    try {
      await clearAllData();
      setStats({
        totalLessons: 0,
        beginnerLessons: 0,
        intermediateLessons: 0,
        advancedLessons: 0,
        totalVocabulary: 0,
        totalQuestions: 0,
      });
      toast({
        title: "Success",
        description: "All data cleared successfully",
      });
    } catch (error) {
      console.error("Failed to clear data:", error);
      toast({
        title: "Error",
        description: "Failed to clear data",
        variant: "destructive",
      });
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle }: {
    icon: any;
    title: string;
    value: number;
    subtitle?: string;
  }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
            <Icon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {value}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {title}
            </p>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 pb-20">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center space-x-2 mb-6">
            <User className="h-6 w-6 text-amber-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Account
            </h1>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
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
          <User className="h-6 w-6 text-amber-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Account
          </h1>
        </div>

        {/* Learning Stats */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-amber-600" />
              <span>Learning Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                icon={BookOpen}
                title="Total Lessons"
                value={stats.totalLessons}
              />
              <StatCard
                icon={Calendar}
                title="Vocabulary Words"
                value={stats.totalVocabulary}
              />
              <StatCard
                icon={Trophy}
                title="Questions Completed"
                value={stats.totalQuestions}
              />
              <StatCard
                icon={Settings}
                title="Avg. Per Lesson"
                value={stats.totalLessons > 0 ? Math.round(stats.totalVocabulary / stats.totalLessons) : 0}
                subtitle="vocabulary words"
              />
            </div>
          </CardContent>
        </Card>

        {/* Level Breakdown */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Learning Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Beginner
                  </Badge>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {stats.beginnerLessons} lessons
                  </span>
                </div>
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: stats.totalLessons > 0 
                        ? `${(stats.beginnerLessons / stats.totalLessons) * 100}%`
                        : '0%'
                    }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    Intermediate
                  </Badge>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {stats.intermediateLessons} lessons
                  </span>
                </div>
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-yellow-600 h-2 rounded-full"
                    style={{
                      width: stats.totalLessons > 0 
                        ? `${(stats.intermediateLessons / stats.totalLessons) * 100}%`
                        : '0%'
                    }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                    Advanced
                  </Badge>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {stats.advancedLessons} lessons
                  </span>
                </div>
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{
                      width: stats.totalLessons > 0 
                        ? `${(stats.advancedLessons / stats.totalLessons) * 100}%`
                        : '0%'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <h3 className="font-medium text-red-900 dark:text-red-100 mb-2">
                  Clear All Data
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                  This will permanently delete all your saved lessons and progress.
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleClearData}
                  className="flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Clear All Data</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}