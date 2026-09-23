import { useState, useRef, useEffect } from "react";

import { getCurrentUserId } from "../../services/userId";

import { postScore } from "../../services/scoreService";

function criarNovoDesafio(nivel) {
  const sortearNumero = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const criarOperacao = () => {
    let numA = sortearNumero(1, 20);
    let numB = sortearNumero(1, 20);

    const operacoesDisponiveis = ["+"];

    if (nivel >= 2) operacoesDisponiveis.push("-");
    if (nivel >= 3) operacoesDisponiveis.push("*");

    const operador =
      operacoesDisponiveis[
        Math.floor(Math.random() * operacoesDisponiveis.length)
      ];

    if (operador === "-") {
      if (numB > numA) {
        const temp = numA;
        numA = numB;
        numB = temp;
      }
    } else if (operador === "*") {
      numA = sortearNumero(2, 10);
      numB = sortearNumero(2, 10);
    }

    let valor = 0;

    if (operador === "+") valor = numA + numB;
    if (operador === "-") valor = numA - numB;
    if (operador === "*") valor = numA * numB;

    return {
      texto: `${numA} ${operador} ${numB}`,
      valor,
    };
  };

  let esquerda = criarOperacao();
  let direita = criarOperacao();

  let tentativas = 10;

  while (esquerda.valor === direita.valor && tentativas > 0) {
    direita = criarOperacao();
    tentativas--;
  }

  const ladoMaior = esquerda.valor > direita.valor ? "esquerda" : "direita";

  return {
    esquerda,
    direita,
    ladoMaior,
  };
}

export function useNumberChallenge() {
  const [nivel, setNivel] = useState(1);

  const [acertosConsecutivos, setAcertosConsecutivos] = useState(0);

  const [desafio, setDesafio] = useState(criarNovoDesafio(1));

  const [score, setScore] = useState(0);

  const [timer, setTimer] = useState(30);

  const [isTimerOn, setIsTimerOn] = useState(false);

  const [reactionTimes, setReactionTimes] = useState([]);

  const [feedback, setFeedback] = useState(null);

  const startTime = useRef(0);

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

  function escolher(lado) {
    if (gameOver || feedback) {
      return;
    }

    const timeSpent = performance.now() - startTime.current;

    setReactionTimes((prev) => [...prev, timeSpent]);

    const acertou = lado === desafio.ladoMaior;

    setFeedback({
      lado,
      resultado: acertou ? "acerto" : "erro",
    });

    let novoNivel = nivel;

    if (acertou) {
      setScore((prev) => prev + 1);

      const novosAcertos = acertosConsecutivos + 1;

      setAcertosConsecutivos(novosAcertos);

      if (novosAcertos % 3 === 0) {
        novoNivel = Math.min(nivel + 1, 3);

        setNivel(novoNivel);
      }
    } else {
      setAcertosConsecutivos(0);
    }

    setTimeout(() => {
      setDesafio(criarNovoDesafio(novoNivel));

      startTime.current = performance.now();

      setFeedback(null);
    }, 150);
  }

  const sumReactionTime = reactionTimes.reduce((a, b) => a + b, 0);

  const avg =
    reactionTimes.length > 0 ? sumReactionTime / reactionTimes.length : 0;

  const avgReactionTime = Number(avg.toFixed(2));

  useEffect(() => {
    if (!gameOver) return;

    async function enviar() {
      const accuracy =
        reactionTimes.length > 0 ? (score / reactionTimes.length) * 100 : 0;

      const result = {
        userId: getCurrentUserId(),
        gameId: "number-challenge",
        score,
        accuracy,
        avgReactionTime,
        levelReached: nivel,
      };

      try {
        await postScore(result);
      } catch (error) {
        console.error("Não foi possível enviar o resultado:", error);
      }
    }

    enviar();
  }, [gameOver]);

  function resetGame() {
    setIsTimerOn(false);
    setScore(0);
    setReactionTimes([]);
    setTimer(30);
    setNivel(1);
    setAcertosConsecutivos(0);
    setFeedback(null);
    setDesafio(criarNovoDesafio(1));
  }

  return {
    desafio,
    score,
    escolher,
    segundos: timer,
    gameOver,
    startTimer,
    avgReactionTime,
    resetGame,
    nivel,
    feedback,
  };
}
