import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Sprout, TreePine, Mountain } from "lucide-react";
import { EnglishLevel } from "@shared/schema";

interface LevelSelectorProps {
  onSelectLevel: (level: EnglishLevel) => void;
  selectedLevel: EnglishLevel | null;
  isLoading: boolean;
}

export function LevelSelector({ onSelectLevel, selectedLevel, isLoading }: LevelSelectorProps) {
  const levels = [
    {
      value: "beginner" as EnglishLevel,
      icon: Sprout,
      title: "Beginner",
      description: "Basic vocabulary and simple structures",
    },
    {
      value: "intermediate" as EnglishLevel,
      icon: TreePine,
      title: "Intermediate", 
      description: "Complex expressions and cultural context",
    },
    {
      value: "advanced" as EnglishLevel,
      icon: Mountain,
      title: "Advanced",
      description: "Nuanced language and advanced idioms",
    },
  ];

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-primary mb-4 flex items-center">
          <Brain className="w-6 h-6 mr-3" />
          Select your English level
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {levels.map((level) => {
            const Icon = level.icon;
            const isSelected = selectedLevel === level.value;
            
            return (
              <Button
                key={level.value}
                variant="outline"
                className={`h-auto p-3 sm:p-4 lg:p-6 transition-all duration-300 flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] ${
                  isSelected 
                    ? 'border-primary bg-accent text-primary' 
                    : 'border-border hover:border-primary hover:bg-accent'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => onSelectLevel(level.value)}
                disabled={isLoading}
              >
                <Icon className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 mb-1 sm:mb-2 lg:mb-3 flex-shrink-0 ${isSelected ? 'text-primary' : 'text-gray-600'}`} />
                <h4 className={`font-semibold text-sm sm:text-base lg:text-lg mb-1 text-center ${isSelected ? 'text-primary' : 'text-gray-800 dark:text-gray-200'}`}>
                  {level.title}
                </h4>
                <p className={`text-xs sm:text-sm lg:text-sm text-center leading-tight px-1 ${isSelected ? 'text-primary/80' : 'text-gray-600 dark:text-gray-400'} line-clamp-2`}>
                  {level.description}
                </p>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}