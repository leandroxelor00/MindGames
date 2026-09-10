import { useEffect, useState } from "react";

export function UseStroopTest() {
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [isTimerOn, setIsTimerOn] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const words = ["AZUL", "AMARELO", "VERMELHO", "VERDE"];

  useEffect(() => {
    if (timer === 0) {
      setGameOver(true);
      setIsTimerOn(false);
    }
  });

  useEffect(() => {
    console.log("effect timer", isTimerOn);
    if (!isTimerOn || gameOver) {
      return;
    }

    const interval = setInterval(() => {
      setTimer((timer) => timer - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isTimerOn]);

  function startTimer() {
    setIsTimerOn(true);
  }

  function isColorCorrect() {
    const currentWord = words[Math.floor(Math.random() * words.length)];
    console.log(currentWord);
    return currentWord;
  }

  return { timer, score, startTimer, isColorCorrect };
}
