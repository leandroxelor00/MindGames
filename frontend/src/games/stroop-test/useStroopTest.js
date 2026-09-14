import { useRef, useEffect, useState } from "react";

export function useStroopTest() {
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [isTimerOn, setIsTimerOn] = useState(false);

  const startTime = useRef(0);

  const words = ["AZUL", "AMARELO", "VERMELHO", "VERDE"];

  const colorMap = {
    AZUL: "#0000FF",
    AMARELO: "#EBE134",
    VERMELHO: "#FF0000",
    VERDE: "#00FF00",
  };

  const [currentWord, setCurrentWord] = useState(words[0]);
  const [currentColor, setCurrentColor] = useState(colorMap[words[0]]);

  const [reactionTimes, setReactionTimes] = useState([]);

  // gameOver é derivado do timer
  const gameOver = timer === 0;

  useEffect(() => {
    if (!isTimerOn || gameOver) {
      return;
    }

    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          setIsTimerOn(false);
          return 0;
        }

        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerOn, gameOver]);

  function startTimer() {
    if (!isTimerOn && !gameOver) {
      setIsTimerOn(true);
      startTime.current = performance.now();
    }
  }

  function changeWord() {
    if (gameOver) return;

    const randomWord = words[Math.floor(Math.random() * words.length)];

    const randomColorKey = words[Math.floor(Math.random() * words.length)];

    setCurrentWord(randomWord);
    setCurrentColor(colorMap[randomColorKey]);

    startTime.current = performance.now();
  }

  function colorCorrect(selectedColorName) {
    if (gameOver || !isTimerOn) return;

    const timeSpent = performance.now() - startTime.current;

    setReactionTimes((prev) => [...prev, timeSpent]);

    const correctColorName = Object.keys(colorMap).find(
      (key) => colorMap[key] === currentColor
    );

    if (correctColorName === selectedColorName) {
      setScore((prev) => prev + 1);
    }
  }

  const sumReactionTime = reactionTimes.reduce((a, b) => a + b, 0);

  const avg =
    reactionTimes.length > 0 ? sumReactionTime / reactionTimes.length : 0;

  const avgReactionTime = Number(avg.toFixed(2));

  function resetGame() {
    setIsTimerOn(false);
    setScore(0);
    setReactionTimes([]);
    setTimer(30);
  }

  return {
    segundos: timer,
    score,
    startTimer,
    currentWord,
    currentColor,
    changeWord,
    colorCorrect,
    avgReactionTime,
    gameOver,
    resetGame,
  };
}
