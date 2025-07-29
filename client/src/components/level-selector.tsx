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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {levels.map((level) => {
            const Icon = level.icon;
            const isSelected = selectedLevel === level.value;
            
            return (
              <Button
                key={level.value}
                variant="outline"
                className={`h-auto p-4 transition-all duration-300 ${
                  isSelected 
                    ? 'border-primary bg-accent' 
                    : 'border-border hover:border-primary hover:bg-accent'
                }`}
                onClick={() => onSelectLevel(level.value)}
                disabled={isLoading}
              >
                <div className="text-center">
                  <Icon className="w-8 h-8 text-primary mb-2 mx-auto" />
                  <h4 className="font-medium text-gray-800">{level.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{level.description}</p>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}