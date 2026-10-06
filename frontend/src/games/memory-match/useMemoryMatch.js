import { useState, useEffect } from "react";
import { postScore } from "../../services/scoreService";
import { useNotification } from "../../context/NotificationContext";
import { buildScorePayload } from "../../services/scorePayload";

export function criarBaralho() {
  const valores = ["🍎", "🍌", "🍇", "🍒", "🍉", "🍓", "🍍", "🥝"];

  const cartas = [...valores, ...valores];

  cartas.sort(() => Math.random() - 0.5);

  return cartas.map((valor, index) => ({
    id: index,
    valor,
    virada: true,
    pareada: false,
  }));
}

export function useMemoryMatch() {
  const [baralho, setBaralho] = useState(criarBaralho());
  const [viradasAgora, setViradasAgora] = useState([]);
  const [tentativas, setTentativas] = useState(0);
  const [segundos, setSegundos] = useState(0);
  const [memorizando, setMemorizando] = useState(true);
  const [mensagemAcessibilidade, setMensagemAcessibilidade] = useState("");

  const { notificar } = useNotification();

  const jogoFinalizado = baralho.every((carta) => carta.pareada);

  useEffect(() => {
    if (!memorizando) {
      return;
    }

    const timer = setTimeout(() => {
      setBaralho((baralhoAtual) =>
        baralhoAtual.map((carta) => ({
          ...carta,
          virada: false,
        }))
      );

      setMemorizando(false);

      setMensagemAcessibilidade("O jogo começou. Escolha duas cartas.");
    }, 2000);

    return () => clearTimeout(timer);
  }, [memorizando]);

  function virarCarta(id) {
    if (memorizando || jogoFinalizado) {
      return;
    }

    if (viradasAgora.length >= 2) {
      return;
    }

    const carta = baralho.find((carta) => carta.id === id);

    if (!carta || carta.virada || carta.pareada) {
      return;
    }

    const novoBaralho = baralho.map((cartaAtual) => {
      if (cartaAtual.id === id) {
        return {
          ...cartaAtual,
          virada: true,
        };
      }

      return cartaAtual;
    });

    setBaralho(novoBaralho);

    setViradasAgora([...viradasAgora, id]);

    setMensagemAcessibilidade(`Carta revelada ${carta.valor}`);
  }

  useEffect(() => {
    if (viradasAgora.length !== 2) {
      return;
    }

    const [id1, id2] = viradasAgora;

    const timer = setTimeout(() => {
      setTentativas((tentativasAtuais) => tentativasAtuais + 1);

      setBaralho((baralhoAtual) => {
        const carta1 = baralhoAtual.find((carta) => carta.id === id1);

        const carta2 = baralhoAtual.find((carta) => carta.id === id2);

        if (!carta1 || !carta2) {
          return baralhoAtual;
        }

        const saoIguais = carta1.valor === carta2.valor;

        if (saoIguais) {
          setMensagemAcessibilidade(`Par encontrado: ${carta1.valor}`);
        } else {
          setMensagemAcessibilidade("Cartas diferentes");
        }

        return baralhoAtual.map((carta) => {
          if (carta.id === id1 || carta.id === id2) {
            if (saoIguais) {
              return {
                ...carta,
                pareada: true,
              };
            }

            return {
              ...carta,
              virada: false,
            };
          }

          return carta;
        });
      });

      setViradasAgora([]);
    }, 800);

    return () => clearTimeout(timer);
  }, [viradasAgora]);

  // Timer do jogo
  useEffect(() => {
    if (jogoFinalizado || memorizando) {
      return;
    }

    const intervalo = setInterval(() => {
      setSegundos((segundosAtuais) => segundosAtuais + 1);
    }, 1000);

    return () => {
      clearInterval(intervalo);
    };
  }, [jogoFinalizado, memorizando]);

  // Envia o resultado quando o jogo termina
  useEffect(() => {
    if (!jogoFinalizado || memorizando) {
      return;
    }

    async function enviar() {
      const paresAcertados =
        baralho.filter((carta) => carta.pareada).length / 2;

      const accuracy =
        tentativas > 0 ? Math.min((paresAcertados / tentativas) * 100, 100) : 0;

      const result = buildScorePayload("memory-match", {
        score: paresAcertados,
        accuracy,
      });

      setMensagemAcessibilidade(
        `Você venceu em ${tentativas} tentativas e ${segundos} segundos`
      );

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
  }, [jogoFinalizado, memorizando, baralho, tentativas, segundos, notificar]);

  function resetGame() {
    setBaralho(criarBaralho());
    setViradasAgora([]);
    setTentativas(0);
    setSegundos(0);
    setMemorizando(true);
    setMensagemAcessibilidade("Novo jogo iniciado. Memorize as cartas.");
  }

  return {
    baralho,
    viradasAgora,
    tentativas,
    segundos,
    memorizando,
    jogoFinalizado,
    virarCarta,
    resetGame,
    mensagemAcessibilidade,
  };
}
