import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, MessageCircle, Loader2 } from "lucide-react";
import { SupportedLanguage, languageOptions } from "@shared/schema";

interface LanguageSelectorProps {
  onSelectLanguage: (language: SupportedLanguage) => void;
  selectedLanguage: SupportedLanguage | null;
  onSkip: () => void;
  onStartLesson: () => void;
  isLoading: boolean;
}

export function LanguageSelector({ 
  onSelectLanguage, 
  selectedLanguage, 
  onSkip, 
  onStartLesson,
  isLoading 
}: LanguageSelectorProps) {
  const handleLanguageSelect = (value: string) => {
    onSelectLanguage(value as SupportedLanguage);
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-primary mb-4 flex items-center">
          <Globe className="w-6 h-6 mr-3" />
          Get meme explanation in your language
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Want to understand this meme better before creating your lesson? 
          Get an explanation in your native language to understand the context and humor.
        </p>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Select onValueChange={handleLanguageSelect} disabled={isLoading}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose explanation language" />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((language) => (
                    <SelectItem key={language.code} value={language.code}>
                      <span className="flex items-center gap-2">
                        <span className="font-medium">{language.nativeName}</span>
                        <span className="text-gray-500">({language.name})</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={() => selectedLanguage && onSelectLanguage(selectedLanguage)}
              disabled={!selectedLanguage || isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating explanation...
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Get explanation
                </>
              )}
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              variant="ghost" 
              onClick={onSkip}
              disabled={isLoading}
              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Skip to level selection
            </Button>
            <Button 
              variant="outline" 
              onClick={onStartLesson}
              disabled={isLoading}
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              Start lesson directly
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}