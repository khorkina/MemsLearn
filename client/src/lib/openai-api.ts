import { EnglishLevel, Lesson } from "@shared/schema";

export async function generateLesson(
  memeTitle: string,
  memeUrl: string,
  level: EnglishLevel,
  memeId: string
): Promise<Lesson> {
  try {
    const response = await fetch("/api/generate-lesson", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        memeTitle,
        memeUrl,
        level,
        memeId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to generate lesson");
    }

    const lesson: Lesson = await response.json();
    return lesson;

  } catch (error) {
    console.error("Failed to generate lesson:", error);
    throw new Error("Failed to generate lesson. Please try again.");
  }
}
