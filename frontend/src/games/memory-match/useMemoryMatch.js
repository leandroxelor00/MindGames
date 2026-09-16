import { useState, useEffect } from "react";

import { getUserId } from "../../services/userId";
import { postScore } from "../../services/scoreService";

export function criarBaralho() {
  const valores = ["🍎", "🍌", "🍇", "🍒", "🍉", "🍓", "🍍", "🥝"];

  const cartas = [...valores, ...valores];

  cartas.sort(() => Math.random() - 0.5);

  return cartas.map((valor, index) => ({
    id: index,
    valor,
    virada: false,
    pareada: false,
  }));
}

export function useMemoryMatch() {
  const [baralho, setBaralho] = useState(criarBaralho());
  const [viradasAgora, setViradasAgora] = useState([]);
  const [tentativas, setTentativas] = useState(0);
  const [segundos, setSegundos] = useState(0);

  // Valor derivado: verifica se todas as cartas foram pareadas
  const jogoFinalizado = baralho.every((carta) => carta.pareada);

  function virarCarta(id) {
    if (viradasAgora.length >= 2) {
      return;
    }

    const carta = baralho.find((carta) => carta.id === id);

    if (!carta || carta.virada || carta.pareada) {
      return;
    }

    const novoBaralho = baralho.map((carta) => {
      if (carta.id === id) {
        return { ...carta, virada: true };
      }

      return carta;
    });

    setBaralho(novoBaralho);
    setViradasAgora([...viradasAgora, id]);
  }

  // Compara as duas cartas selecionadas
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

        return baralhoAtual.map((carta) => {
          if (carta.id === id1 || carta.id === id2) {
            if (saoIguais) {
              return { ...carta, pareada: true };
            }

            return { ...carta, virada: false };
          }

          return carta;
        });
      });

      setViradasAgora([]);
    }, 800);

    return () => clearTimeout(timer);
  }, [viradasAgora]);

  // Cronômetro
  useEffect(() => {
    if (jogoFinalizado) {
      return;
    }

    const intervalo = setInterval(() => {
      setSegundos((segundosAtuais) => segundosAtuais + 1);
    }, 1000);

    return () => {
      clearInterval(intervalo);
    };
  }, [jogoFinalizado]);

  // Envia o resultado quando o jogo termina
  useEffect(() => {
    if (!jogoFinalizado) {
      return;
    }

    async function enviar() {
      const paresAcertados =
        baralho.filter((carta) => carta.pareada).length / 2;

      const accuracy =
        tentativas > 0
          ? Math.min((paresAcertados / tentativas) * 100, 100)
          : 0;

      const result = {
        userId: getUserId(),
        gameId: "memory-match",
        score: paresAcertados,
        accuracy,
        avgReactionTime: 0,
        levelReached: 1,
      };

      try {
        await postScore(result);
      } catch (error) {
        console.error("Não foi possível enviar o resultado:", error);
      }
    }

    enviar();
  }, [jogoFinalizado]);

  function resetGame() {
    setBaralho(criarBaralho());
    setViradasAgora([]);
    setTentativas(0);
    setSegundos(0);
  }

  return {
    baralho,
    viradasAgora,
    tentativas,
    segundos,
    jogoFinalizado,
    virarCarta,
    resetGame,
  };
}