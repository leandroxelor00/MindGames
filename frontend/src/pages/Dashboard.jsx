import { useEffect, useState } from "react";
import { getUserId } from "../services/userId";
import { getHistory } from "../services/scoreService";

function calcularMediasPorJogo(partidas) {
  const gameIds = [...new Set(partidas.map((partida) => partida.gameId))];

  const medias = {};

  gameIds.forEach((gameId) => {
    const partidasDoJogo = partidas.filter(
      (partida) => partida.gameId === gameId,
    );

    const totalPartidas = partidasDoJogo.length;

    const somaScore = partidasDoJogo.reduce(
      (total, partida) => total + partida.score,
      0,
    );

    const somaAccuracy = partidasDoJogo.reduce(
      (total, partida) => total + partida.accuracy,
      0,
    );

    const mediaScore = somaScore / totalPartidas;
    const mediaAccuracy = somaAccuracy / totalPartidas;

    medias[gameId] = {
      totalPartidas,
      mediaScore,
      mediaAccuracy,
    };
  });

  return medias;
}

export function Dashboard() {
  const [partidas, setPartidas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarHistorico() {
      try {
        const userId = getUserId();
        const historico = await getHistory(userId);

        setPartidas(historico);
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarHistorico();
  }, []);

  const mediasPorJogo = calcularMediasPorJogo(partidas);

  return (
    <div>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <h2>Resumo por jogo</h2>

          <ul>
            {Object.entries(mediasPorJogo).map(([gameId, media]) => (
              <li key={gameId}>
                <p>Jogo: {gameId}</p>
                <p>Total de partidas: {media.totalPartidas}</p>
                <p>Score médio: {media.mediaScore.toFixed(1)}</p>
                <p>Precisão média: {media.mediaAccuracy.toFixed(1)}%</p>
              </li>
            ))}
          </ul>

          <h2>Partidas</h2>

          <ul>
            {partidas.map((partida) => (
              <li key={partida.id}>
                <p>Jogo: {partida.gameId}</p>
                <p>Score: {partida.score}</p>
                <p>Precisão: {partida.accuracy}%</p>
                <p>Data: {partida.playedAt}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
