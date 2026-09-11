// @ts-nocheck
import { useRef, useEffect, useState } from "react";

export function UseStroopTest() {
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [isTimerOn, setIsTimerOn] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const words = ["AZUL", "AMARELO", "VERMELHO", "VERDE"];
  const colors = ["#FF0000", "#00FF00", "#0000FF", "#EBE134"];

  const [currentWord, setCurrentWord] = useState(words[0]);
  const [currentColor, setCurrentColor] = useState(colors[0]);

  const [reactionTimes, setReactionTimes] = useState([]);
  const startTime = useRef(performance.now());

  useEffect(() => {
    if (timer === 0) {
      setGameOver(true);
      setIsTimerOn(false);
      setTimer(0);

      alert("O jogo acabou!");
      alert(`Pontuação: ${score}`);
    }
  }, [timer]);

  useEffect(() => {
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

  function removeColor(color) {
    const newColors = colors.filter((item) => item !== color);
    setCurrentColor(newColors[Math.floor(Math.random() * newColors.length)]);
  }

  function changeWord() {
    startTime.current = performance.now();
    setCurrentWord(words[Math.floor(Math.random() * words.length)]);

    if (currentWord === "VERMELHO") {
      removeColor("#FF0000");
    }
    if (currentWord === "VERDE") {
      removeColor("#00FF00");
    }
    if (currentWord === "AZUL") {
      removeColor("#0000FF");
    }
    if (currentWord === "AMARELO") {
      removeColor("#EBE134");
    }
  }

  function colorCorrect(color) {
    const timeSpend = performance.now() - startTime.current;
    setReactionTimes((reactionTimes) => [...reactionTimes, timeSpend]);
    if (gameOver) {
      return;
    }

    if (currentWord === color) {
      setScore((score) => score + 1);
    }
  }

  const sumReactionTime = reactionTimes.reduce(
    (a, reactionTime) => a + reactionTime,
    0
  );

  const avg = sumReactionTime / reactionTimes.length;
  const avgReactionTime = Number(avg.toFixed(2));

  return {
    timer,
    score,
    startTimer,
    currentWord,
    currentColor,
    changeWord,
    colorCorrect,
    avgReactionTime,
  };
}
