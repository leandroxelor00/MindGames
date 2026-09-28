import { useEffect, useState } from "react";
import { getHistory } from "../services/scoreService";
import styles from "./Dashboard.module.css";
import { Link } from "react-router-dom";

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

function formatarData(playedAt) {
  const dataCorrigida = playedAt.replace(" ", "T") + "Z";

  const data = new Date(dataCorrigida);

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  }).format(data);
}

export function Dashboard() {
  const [partidas, setPartidas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarHistorico() {
      try {
        const historico = await getHistory();
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

  if (loading) {
    return (
      <main className={styles.container}>
        <div className={styles.carregando}>
          <p>Carregando...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.topo}>
        <h1 className={styles.titulo}>Dashboard</h1>

        <Link to="/" className={styles.voltarLink}>
          ← Voltar
        </Link>
      </div>

      <section className={styles.secao}>
        <h2 className={styles.subtitulo}>Resumo por jogo</h2>

        {Object.keys(mediasPorJogo).length === 0 ? (
          <div className={styles.semPartidas}>
            <p>Você ainda não possui partidas registradas.</p>
          </div>
        ) : (
          <div className={styles.resumoGrid}>
            {Object.entries(mediasPorJogo).map(([gameId, media]) => (
              <article className={styles.cardJogo} key={gameId}>
                <h3 className={styles.nomeJogo}>{gameId}</h3>

                <div className={styles.estatisticas}>
                  <div className={styles.estatistica}>
                    <span className={styles.label}>Total de partidas</span>
                    <span className={styles.valor}>{media.totalPartidas}</span>
                  </div>

                  <div className={styles.estatistica}>
                    <span className={styles.label}>Score médio</span>
                    <span className={styles.valor}>
                      {media.mediaScore.toFixed(1)}
                    </span>
                  </div>

                  <div className={styles.estatistica}>
                    <span className={styles.label}>Precisão média</span>
                    <span className={styles.valor}>
                      {media.mediaAccuracy.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className={styles.secao}>
        <h2 className={styles.subtitulo}>Histórico de partidas</h2>

        {partidas.length === 0 ? (
          <div className={styles.semPartidas}>
            <p>Nenhuma partida encontrada.</p>
          </div>
        ) : (
          <div className={styles.historico}>
            {partidas.map((partida) => (
              <article className={styles.partida} key={partida.id}>
                <div className={styles.infoPartida}>
                  <p className={styles.jogo}>{partida.gameId}</p>

                  <p className={styles.data}>
                    {formatarData(partida.playedAt)}
                  </p>
                </div>

                <div className={styles.resultado}>
                  <div className={styles.resultadoItem}>
                    <span className={styles.resultadoLabel}>Score</span>

                    <span className={styles.resultadoValor}>
                      {partida.score}
                    </span>
                  </div>

                  <div className={styles.resultadoItem}>
                    <span className={styles.resultadoLabel}>Precisão</span>

                    <span className={styles.resultadoValor}>
                      {partida.accuracy.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
