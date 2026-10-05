import { useRef, useState } from "react";

export function useAdaptiveDifficulty({
  windowSize = 5,
  aswToIncreaseLv = 4,
  aswToDecreaseLv = 3,
  levelMin = 1,
  levelMax = 3,
} = {}) {
  const [currentLevel, setCurrentLevel] = useState(levelMin);
  const lastAnswers = useRef([]);

  function report(success) {
    lastAnswers.current = [...lastAnswers.current, success].slice(-windowSize);

    const correctAnswers = lastAnswers.current.filter(
      (correct) => correct,
    ).length;

    const wrongAnswers = lastAnswers.current.length - correctAnswers;

    if (correctAnswers >= aswToIncreaseLv) {
      if (currentLevel === levelMax) {
        return currentLevel;
      }
      const newLevel = Math.min(currentLevel + 1, levelMax);
      setCurrentLevel(newLevel);
      lastAnswers.current = [];
      return newLevel;
    }

    if (wrongAnswers >= aswToDecreaseLv) {
      if (currentLevel === levelMin) {
        return currentLevel;
      }
      const newLevel = Math.max(currentLevel - 1, levelMin);
      setCurrentLevel(newLevel);
      lastAnswers.current = [];
      return newLevel;
    }
    return currentLevel;
  }

  function reset() {
    setCurrentLevel(levelMin);
    lastAnswers.current = [];
  }

  return { currentLevel, report, reset };
}
