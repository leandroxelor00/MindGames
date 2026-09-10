import { use, useEffect, useState } from "react";

export function UseStroopTest() {
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [isTimerOn, setIsTimerOn] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const words = ["AZUL", "AMARELO", "VERMELHO", "VERDE"];
  const colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00"];

  const [currentWord, setCurrentWord] = useState(words[0]);
  const [currentColor, setCurrentColor] = useState(colors[0]);

  useEffect(() => {
    if (timer === 0) {
      setGameOver(true);
      setIsTimerOn(false);

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
    setCurrentWord(words[Math.floor(Math.random() * words.length)]);

    if (currentWord === "VERMELHO") {
      removeColor("#FF0000");
    }
    if (currentWord === "VERDE") {
      removeColor("#00FF00F");
    }
    if (currentWord === "AZUL") {
      removeColor("#0000FF");
    }
    if (currentWord === "AMARELO") {
      removeColor("#FFFF00");
    }
  }

  function isColorBlue() {
    if (currentWord === "AZUL") {
      setScore((score) => score + 1);
    }
  }
  function isColorGreen() {
    if (currentWord === "VERDE") {
      setScore((score) => score + 1);
    }
  }
  function isColorRed() {
    if (currentWord === "VERMELHO") {
      setScore((score) => score + 1);
    }
  }
  function isColorYellow() {
    if (currentWord === "AMARELO") {
      setScore((score) => score + 1);
    }
  }

  return {
    timer,
    score,
    startTimer,
    currentWord,
    currentColor,
    changeWord,
    isColorBlue,
    isColorGreen,
    isColorRed,
    isColorYellow,
  };
}
