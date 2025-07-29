import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, PenTool } from "lucide-react";
import { Lesson } from "@shared/schema";
import { useLesson } from "@/hooks/use-lesson";

interface InteractiveQuizProps {
  lesson: Lesson;
}

export function InteractiveQuiz({ lesson }: InteractiveQuizProps) {
  const { userAnswers, updateAnswer } = useLesson(null);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSubmit = () => {
    // Calculate results
    let correctAnswers = 0;
    const totalQuestions = lesson.questions.length;

    const questionResults = lesson.questions.map(question => {
      const userAnswer = userAnswers[question.id] || "";
      const isCorrect = userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
      
      if (isCorrect) correctAnswers++;
      
      return {
        questionId: question.id,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation,
        question: question.question,
      };
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);

    setResults({
      score,
      correctAnswers,
      totalQuestions,
      results: questionResults,
    });
    setShowResults(true);
  };

  const allQuestionsAnswered = lesson.questions.every(q => userAnswers[q.id]);

  return (
    <>
      {/* Questions */}
      <Card className="shadow-lg mb-6">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-primary mb-4 flex items-center">
            <PenTool className="w-6 h-6 mr-3" />
            Interactive Exercise
          </h3>

          <div className="space-y-6">
            {lesson.questions.map((question, index) => (
              <div key={question.id} className="p-4 bg-accent rounded-lg">
                <h4 className="font-medium text-gray-800 mb-3">
                  {index + 1}. {question.question}
                </h4>

                {question.type === "multiple_choice" && (
                  <RadioGroup
                    value={userAnswers[question.id] || ""}
                    onValueChange={(value) => updateAnswer(question.id, value)}
                  >
                    {question.options?.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`${question.id}-${optionIndex}`} />
                        <Label htmlFor={`${question.id}-${optionIndex}`} className="cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {question.type === "fill_in_the_gap" && (
                  <Input
                    placeholder="Type your answer here..."
                    value={userAnswers[question.id] || ""}
                    onChange={(e) => updateAnswer(question.id, e.target.value)}
                    className="mt-2"
                  />
                )}

                {question.type === "true_false" && (
                  <RadioGroup
                    value={userAnswers[question.id] || ""}
                    onValueChange={(value) => updateAnswer(question.id, value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="True" id={`${question.id}-true`} />
                      <Label htmlFor={`${question.id}-true`} className="cursor-pointer">
                        True
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="False" id={`${question.id}-false`} />
                      <Label htmlFor={`${question.id}-false`} className="cursor-pointer">
                        False
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              </div>
            ))}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!allQuestionsAnswered}
            className="mt-6 bg-primary hover:bg-primary/90 text-white"
          >
            Check Answers
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {showResults && results && (
        <Card className="shadow-lg mb-6">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-primary mb-4 flex items-center">
              <CheckCircle2 className="w-6 h-6 mr-3" />
              Answer Check
            </h3>

            <div className="space-y-4 mb-6">
              {results.results.map((result: any, index: number) => (
                <div
                  key={result.questionId}
                  className={`p-4 rounded border-l-4 ${
                    result.isCorrect
                      ? "bg-green-50 border-green-400"
                      : "bg-red-50 border-red-400"
                  }`}
                >
                  <h4 className={`font-medium ${
                    result.isCorrect ? "text-green-800" : "text-red-800"
                  }`}>
                    Question {index + 1}: {result.isCorrect ? "Correct! ✓" : "Incorrect ✗"}
                  </h4>
                  <p className={`text-sm mt-1 ${
                    result.isCorrect ? "text-green-700" : "text-red-700"
                  }`}>
                    {result.explanation}
                  </p>
                  {!result.isCorrect && (
                    <p className="text-sm text-gray-600 mt-1">
                      Your answer: "{result.userAnswer}" | Correct answer: "{result.correctAnswer}"
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 bg-accent rounded-lg">
              <h4 className="font-medium text-primary">
                Your Score: {results.correctAnswers}/{results.totalQuestions} ({results.score}%)
              </h4>
              <p className="text-gray-600 text-sm mt-1">
                {results.score >= 80
                  ? "Excellent work! You're understanding the context and vocabulary very well."
                  : results.score >= 60
                  ? "Good job! Keep practicing to improve your understanding."
                  : "Don't worry, learning takes time. Review the vocabulary and try again!"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}