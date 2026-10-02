import { useState, useRef, useEffect } from "react";
import { getCurrentUserId } from "../../services/userId";
import { postScore } from "../../services/scoreService";

export function useReactionTime() {
  const [status, setStatus] = useState("idle");
  const [reactionTime, setReactionTime] = useState(null);
  const [mensagemAcessibilidade, setMensagemAcessibilidade] = useState("");
  const startTime = useRef(0);
  const timeoutId = useRef(null);

  function iniciar() {
    setStatus("waiting");
    setMensagemAcessibilidade("Jogo iniciado. Aguarde a mudança de cor.");
    const tempo = Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000;

    timeoutId.current = setTimeout(() => {
      setStatus("ready");
      setMensagemAcessibilidade("A cor mudou. Clique agora.");
      startTime.current = performance.now();
    }, tempo);
  }

  function clicarTela() {
    if (status === "waiting") {
      clearTimeout(timeoutId.current);
      setStatus("tooSoon");
      setMensagemAcessibilidade("Você clicou cedo demais. Tente novamente.");
      return;
    }

    if (status === "ready") {
      const tempo = performance.now() - startTime.current;
      setReactionTime(tempo);
      setStatus("done");
      setMensagemAcessibilidade(
        `Seu tempo de reação foi ${tempo.toFixed(0)} milissegundos`,
      );
    }
  }

  function tentarNovamente() {
    setStatus("idle");
    setReactionTime(null);
    setMensagemAcessibilidade("Clique para começar novamente.");
  }

  useEffect(() => {
    if (status !== "done" || reactionTime === null) {
      return;
    }

    async function enviar() {
      const resultado = {
        userId: getCurrentUserId(),
        gameId: "reaction-time",
        score: reactionTime,
        accuracy: 100,
        avgReactionTime: reactionTime,
        levelReached: 1,
      };

      try {
        await postScore(resultado);
      } catch (error) {
        console.error("Não foi possível enviar o resultado:", error);
      }
    }

    enviar();
  }, [status, reactionTime]);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutId.current);
    };
  }, []);

  return {
    status,
    reactionTime,
    iniciar,
    clicarTela,
    tentarNovamente,
    mensagemAcessibilidade,
  };
}
