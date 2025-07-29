import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { MemeExplanation } from "@shared/schema";
import { languageOptions } from "@shared/schema";

interface MemeExplanationProps {
  explanation: MemeExplanation;
  onContinue: () => void;
}

export function MemeExplanationDisplay({ explanation, onContinue }: MemeExplanationProps) {
  const selectedLanguage = languageOptions.find(lang => lang.code === explanation.language);

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-primary flex items-center">
            <CheckCircle className="w-6 h-6 mr-3 text-green-500" />
            Meme Explanation
          </h3>
          {selectedLanguage && (
            <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
              {selectedLanguage.nativeName}
            </span>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Explanation:
            </h4>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {explanation.explanation}
            </p>
          </div>

          {explanation.culturalContext && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Cultural Context:
              </h4>
              <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                {explanation.culturalContext}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Button 
            onClick={onContinue}
            className="bg-primary hover:bg-primary/90"
          >
            Continue to level selection
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}