
import React, { useMemo, useState } from "react";
import { plantQuizzes, PlantQuizQuestion } from "@/data/plantQuizzes";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

interface PlantQuizProps {
  plantName: string;
}

export const PlantQuiz: React.FC<PlantQuizProps> = ({ plantName }) => {
  const quizData = plantQuizzes[plantName];
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>([null, null, null]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  // Get 3 random questions for this plant
  const questions: PlantQuizQuestion[] = useMemo(() => {
    if (!quizData) return [];
    const shuffled = [...quizData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, [quizData]);

  const handleOptionChange = (qIdx: number, optionIdx: number) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[qIdx] = optionIdx.toString();
    setSelectedAnswers(updatedAnswers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizData) return;
    let currentScore = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] !== null && Number(selectedAnswers[idx]) === q.answer) {
        currentScore++;
      }
    });
    setScore(currentScore);
    setSubmitted(true);
  };

  if (!quizData) {
    return (
      <div className="bg-yellow-100 text-yellow-700 rounded-lg p-4 text-center mt-6">
        No quiz available for this plant.
      </div>
    );
  }

  return (
    <div className="w-full mt-10 mb-4 p-6 bg-white/90 border border-green-200 rounded-2xl shadow-lg">
      <h3 className="text-2xl font-semibold text-green-800 mb-4 text-center">
        Quiz: Test Your Knowledge on {plantName}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((q, idx) => (
          <div key={idx} className="mb-4">
            <div className="font-semibold mb-2">{idx + 1}. {q.question}</div>
            <RadioGroup
              value={selectedAnswers[idx] ?? ""}
              onValueChange={(value) => handleOptionChange(idx, Number(value))}
              className="flex flex-col gap-2"
              required
            >
              {q.options.map((opt, oIdx) => (
                <label key={oIdx} className="flex items-center cursor-pointer gap-2">
                  <RadioGroupItem value={oIdx.toString()} />
                  <span>{opt}</span>
                </label>
              ))}
            </RadioGroup>
          </div>
        ))}
        <div className="flex justify-center">
          <Button type="submit" className="px-6" disabled={submitted}>
            {submitted ? "Submitted" : "Submit Answers"}
          </Button>
        </div>
      </form>
      {submitted && (
        <div className="text-center mt-4 text-lg font-semibold text-green-700">
          You got {score} out of {questions.length} correct!
        </div>
      )}
    </div>
  );
};
