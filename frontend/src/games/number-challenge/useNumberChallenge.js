import { useState, useRef, useEffect } from "react";
import { getCurrentUserId } from "../../services/userId";
import { postScore } from "../../services/scoreService";
import { useAdaptiveDifficulty } from "../../hooks/useAdaptiveDifficulty";
import { useNotification } from "../../context/NotificationContext";

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

  return {
    esquerda,
    direita,
    ladoMaior: esquerda.valor > direita.valor ? "esquerda" : "direita",
  };
}

export function useNumberChallenge() {
  const { currentLevel, report, reset } = useAdaptiveDifficulty({
    windowSize: 3,
    aswToIncreaseLv: 3,
    aswToDecreaseLv: 4,
    levelMax: 3,
  });

  const [desafio, setDesafio] = useState(criarNovoDesafio(1));

  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [isTimerOn, setIsTimerOn] = useState(false);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [mensagemAcessibilidade, setMensagemAcessibilidade] = useState("");
  const startTime = useRef(0);
  const scoreRef = useRef(score);
  const gameOver = timer === 0;

  const { notificar } = useNotification();

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    if (!isTimerOn || gameOver) return;

    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          setIsTimerOn(false);

          setMensagemAcessibilidade(
            `Fim de jogo. Sua pontuação foi ${scoreRef.current}.`
          );

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

      setMensagemAcessibilidade("O desafio começou. Escolha a maior operação.");
    }
  }

  function escolher(lado) {
    if (gameOver || feedback) return;

    const timeSpent = performance.now() - startTime.current;

    setReactionTimes((prev) => [...prev, timeSpent]);

    const acertou = lado === desafio.ladoMaior;

    setFeedback({
      lado,
      resultado: acertou ? "acerto" : "erro",
    });

    if (acertou) {
      setScore((prev) => prev + 1);

      setMensagemAcessibilidade(
        "Resposta correta. Preparando próximo desafio."
      );
    } else {
      setMensagemAcessibilidade("Resposta incorreta.");
    }

    const novoNivel = report(acertou);

    if (novoNivel > currentLevel) {
      setMensagemAcessibilidade(
        `Parabéns! Você alcançou o nível ${novoNivel}.`
      );
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

      const result = buildScorePayload("number-challenge", {
        score,
        accuracy,
        avgReactionTime,
        levelReached: currentLevel,
      });

      try {
        await postScore(result);
      } catch (error) {
        console.error("Não foi possível enviar o resultado:", error);

        notificar(
          "Não foi possível salvar sua pontuação. Verifique sua conexão."
        );
      }
    }

    enviar();
  }, [
    gameOver,
    score,
    avgReactionTime,
    currentLevel,
    reactionTimes.length,
    notificar,
  ]);

  function resetGame() {
    setIsTimerOn(false);

    setScore(0);

    setReactionTimes([]);

    setTimer(30);

    reset();

    setFeedback(null);

    setDesafio(criarNovoDesafio(1));

    setMensagemAcessibilidade("Novo jogo iniciado.");
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
    nivel: currentLevel,
    feedback,
    mensagemAcessibilidade,
  };
}
