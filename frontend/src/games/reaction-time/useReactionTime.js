import { useState, useRef, useEffect } from "react";
import { getCurrentUserId } from "../../services/userId";
import { postScore } from "../../services/scoreService";

const TOTAL_TENTATIVAS = 5;

export function useReactionTime() {
  const [status, setStatus] = useState("idle");
  const [reactionTime, setReactionTime] = useState(null);
  const [tempos, setTempos] = useState([]);
  const [mensagemAcessibilidade, setMensagemAcessibilidade] =
    useState("");

  const startTime = useRef(0);
  const timeoutId = useRef(null);

  function iniciar() {
    setStatus("waiting");
    setMensagemAcessibilidade(
      `Tentativa ${tempos.length + 1} de ${TOTAL_TENTATIVAS}. Jogo iniciado. Aguarde a mudança de cor.`,
    );

    const tempo =
      Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000;

    timeoutId.current = setTimeout(() => {
      setStatus("ready");
      setMensagemAcessibilidade(
        `Tentativa ${tempos.length + 1} de ${TOTAL_TENTATIVAS}. A cor mudou. Clique agora.`,
      );

      startTime.current = performance.now();
    }, tempo);
  }

  function clicarTela() {
    if (status === "waiting") {
      clearTimeout(timeoutId.current);

      setStatus("tooSoon");

      setMensagemAcessibilidade(
        "Você clicou cedo demais. Essa tentativa não foi contabilizada. Tente novamente.",
      );

      return;
    }

    if (status === "ready") {
      const tempo =
        performance.now() - startTime.current;

      const novosTempos = [...tempos, tempo];

      setTempos(novosTempos);
      setReactionTime(tempo);

      if (novosTempos.length === TOTAL_TENTATIVAS) {
        const soma = novosTempos.reduce(
          (total, valor) => total + valor,
          0,
        );

        const media = soma / TOTAL_TENTATIVAS;

        setReactionTime(media);
        setStatus("done");

        setMensagemAcessibilidade(
          `Teste finalizado. Sua média de tempo de reação foi ${media.toFixed(
            0,
          )} milissegundos.`,
        );

        return;
      }

      setStatus("result");

      setMensagemAcessibilidade(
        `Tempo de reação: ${tempo.toFixed(
          0,
        )} milissegundos. Próxima tentativa.`,
      );
    }
  }

  function proximaTentativa() {
    iniciar();
  }

  function tentarNovamente() {
    clearTimeout(timeoutId.current);

    setStatus("idle");
    setReactionTime(null);
    setTempos([]);
    setMensagemAcessibilidade(
      "Clique para começar novamente.",
    );
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
        console.error(
          "Não foi possível enviar o resultado:",
          error,
        );
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
    tempos,
    tentativaAtual: tempos.length,
    totalTentativas: TOTAL_TENTATIVAS,
    iniciar,
    clicarTela,
    proximaTentativa,
    tentarNovamente,
    mensagemAcessibilidade,
  };
}