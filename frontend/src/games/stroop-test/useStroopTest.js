import { useRef, useEffect, useState } from "react";

import { getCurrentUserId } from "../../services/userId";
import { postScore } from "../../services/scoreService";

const words = ["AZUL", "AMARELO", "VERMELHO", "VERDE"];

const colorMap = {
  AZUL: "#0000FF",
  AMARELO: "#B8860B",
  VERMELHO: "#CC0000",
  VERDE: "#008000",
};

export function useStroopTest() {
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [isTimerOn, setIsTimerOn] = useState(false);

  const startTime = useRef(0);

  const [currentWord, setCurrentWord] = useState(words[0]);
  const [currentColor, setCurrentColor] = useState(colorMap[words[0]]);

  const [reactionTimes, setReactionTimes] = useState([]);

  const [mensagemAcessibilidade, setMensagemAcessibilidade] = useState("");

  const gameOver = timer === 0;

  useEffect(() => {
    startTime.current = performance.now();
  }, []);

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
  }, [gameOver, isTimerOn]);

  function startTimer() {
    if (!isTimerOn && !gameOver) {
      setIsTimerOn(true);

      setMensagemAcessibilidade(
        "Jogo iniciado. Escolha a cor correta da palavra."
      );
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
    if (gameOver) return;

    const timeSpent = performance.now() - startTime.current;

    setReactionTimes((prev) => [...prev, timeSpent]);

    const correctColorName = Object.keys(colorMap).find(
      (key) => colorMap[key] === currentColor
    );

    if (correctColorName === selectedColorName) {
      setScore((prev) => prev + 1);

      setMensagemAcessibilidade(
        `Resposta correta. A cor era ${correctColorName}`
      );
    } else {
      setMensagemAcessibilidade(
        `Resposta errada. A cor correta era ${correctColorName}`
      );
    }
  }

  const sumReactionTime = reactionTimes.reduce((a, b) => a + b, 0);

  const avg =
    reactionTimes.length > 0 ? sumReactionTime / reactionTimes.length : 0;

  const avgReactionTime = Number(avg.toFixed(2));

  useEffect(() => {
    if (!gameOver) {
      return;
    }

    async function enviar() {
      const accuracy =
        reactionTimes.length > 0 ? (score / reactionTimes.length) * 100 : 0;

      const result = {
        userId: getCurrentUserId(),
        gameId: "stroop-test",
        score,
        accuracy,
        avgReactionTime,
        levelReached: 1,
      };

      try {
        await postScore(result);
      } catch (error) {
        console.error("Não foi possível enviar o resultado:", error);
      }
    }

    enviar();
  }, [gameOver, reactionTimes.length, score, avgReactionTime]);

  function resetGame() {
    setIsTimerOn(false);

    setScore(0);

    setReactionTimes([]);

    setTimer(30);

    startTime.current = performance.now();

    setMensagemAcessibilidade("Novo jogo iniciado.");
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

    mensagemAcessibilidade,
  };
}
