import { useState, useEffect } from "react";
import { getCurrentUserId } from "../../services/userId";
import { postScore } from "../../services/scoreService";
const emojis = [
  "🍔",
  "🍕",
  "🌭",
  "🍟",
  "🌮",
  "🌯",
  "🥪",
  "🍿",
  "🍩",
  "🍪",
  "🍰",
  "🧁",
  "🍫",
  "🍣",
  "🍜",
];

export function gerarPosicao(posisoesExistentes) {
  const tentativasMaximas = 50;
  const distanciaMinima = 20;

  for (let tentativas = 0; tentativas < tentativasMaximas; tentativas++) {
    const x = Math.floor(Math.random() * 81) + 10;
    const y = Math.floor(Math.random() * 81) + 10;
    let muitoPerto = false;

    for (const posicao of posisoesExistentes) {
      const distancia = Math.hypot(x - posicao.x, y - posicao.y);
      if (distancia < distanciaMinima) {
        muitoPerto = true;
        break;
      }
    }
    if (!muitoPerto) {
      return { x, y };
    }
  }
  return {
    x: Math.floor(Math.random() * 81) + 10,
    y: Math.floor(Math.random() * 81) + 10,
  };
}

export function gerarFase(numeroFase) {
  const emojisDaFase = emojis.slice(0, numeroFase);
  const imagensGeradas = [];
  const posicoesOcupadas = [];

  emojisDaFase.forEach((emoji, index) => {
    const novaPosicao = gerarPosicao(posicoesOcupadas);
    posicoesOcupadas.push(novaPosicao);
    imagensGeradas.push({
      id: index,
      emoji: emoji,
      x: novaPosicao.x,
      y: novaPosicao.y,
    });
  });
  return imagensGeradas;
}

export function useFoodMemory() {
  const [fase, setFase] = useState(1);
  const [imagens, setImagens] = useState(gerarFase(1));
  const [erros, setErros] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [venceu, setVenceu] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (!gameOver) return;

    async function enviar() {
      const fasesCompletadas = venceu ? fase : fase - 1;

      const result = {
        userId: getCurrentUserId(),
        gameId: "food-memory",
        score: fasesCompletadas,
        accuracy: venceu ? 100 : 0,
        avgReactionTime: 0,
        levelReached: fasesCompletadas,
      };

      try {
        await postScore(result);
      } catch (error) {
        console.error("Não foi possível enviar o resultado:", error);
      }
    }

    enviar();
  }, [gameOver]);

  function clicarImagem(id) {
    if (gameOver || venceu || feedback) return;

    const idNovoEmoji = fase - 1;

    if (id === idNovoEmoji) {
      setFeedback({
        id,
        tipo: "acerto",
      });

      setTimeout(() => {
        setFeedback(null);

        if (fase === 15) {
          setVenceu(true);
          setGameOver(true);
        } else {
          const novaFase = fase + 1;

          setFase(novaFase);
          setErros(0);
          setImagens(gerarFase(novaFase));
        }
      }, 200);
    } else {
      setFeedback({
        id,
        tipo: "erro",
      });

      const quantidadeErros = erros + 1;

      setErros(quantidadeErros);

      setTimeout(() => {
        setFeedback(null);

        if (quantidadeErros >= 3) {
          setGameOver(true);
        }
      }, 200);
    }
  }

  function reiniciarJogo() {
    setFase(1);
    setErros(0);
    setGameOver(false);
    setVenceu(false);
    setFeedback(null);
    setImagens(gerarFase(1));
  }

  return {
    fase,
    imagens,
    erros,
    gameOver,
    venceu,
    feedback,
    clicarImagem,
    reiniciarJogo,
  };
}
