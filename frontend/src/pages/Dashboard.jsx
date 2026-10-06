import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getHistory, getSummary } from "../services/scoreService";
import { CognitiveRadar } from "../components/CognitiveRadar/CognitiveRadar";
import { Speakable } from "../components/Speakable/Speakable";

import styles from "./Dashboard.module.css";

import { gamesRegistry } from "../games/registry";
import { games } from "../config/gamesConfig";

function metricaPrincipal(gameId) {
  const rule = games[gameId]?.rule ?? "accuracy";

  if (rule === "level") {
    return {
      key: "levelReached",
      label: "Nível médio",
      partidaLabel: "Nível",
      format: (v) => String(Math.round(Number(v) || 0)),
    };
  }

  if (rule === "reaction") {
    return {
      key: "avgReactionTime",
      label: "Tempo médio",
      partidaLabel: "Tempo",
      format: (v) => `${Number(v).toFixed(0)} ms`,
    };
  }

  return {
    key: "accuracy",
    label: "Precisão média",
    partidaLabel: "Precisão",
    format: (v) => `${Number(v).toFixed(1)}%`,
  };
}

function calcularMediasPorJogo(partidas) {
  const gameIds = [
    ...new Set(partidas.map((partida) => partida.gameId)),
  ];

  const medias = {};

  gameIds.forEach((gameId) => {
    const partidasDoJogo = partidas.filter(
      (partida) => partida.gameId === gameId,
    );

    const totalPartidas = partidasDoJogo.length;
    const metrica = metricaPrincipal(gameId);

    const somaScore = partidasDoJogo.reduce(
      (total, partida) => total + partida.score,
      0,
    );

    const somaMetrica = partidasDoJogo.reduce(
      (total, partida) =>
        total + (Number(partida[metrica.key]) || 0),
      0,
    );

    medias[gameId] = {
      totalPartidas,
      mediaScore: somaScore / totalPartidas,
      metrica,
      mediaMetrica: somaMetrica / totalPartidas,
    };
  });

  return medias;
}

function formatarNomeJogo(gameId) {
  const jogo = gamesRegistry.find(
    (game) => game.id === gameId,
  );

  return jogo?.name || gameId;
}

function formatarScore(gameId, score) {
  const valor = Number(score).toFixed(2);

  if (gameId === "reaction-time") {
    return `${valor} ms`;
  }

  return valor;
}

function formatarMediaScore(gameId, score) {
  const valor = Number(score).toFixed(1);

  if (gameId === "reaction-time") {
    return `${valor} ms`;
  }

  return valor;
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

  const [summary, setSummary] = useState({
    memoria: 0,
    atencao: 0,
    velocidade: 0,
    logica: 0,
  });

  useEffect(() => {
    async function carregarHistorico() {
      try {
        const [historico, resumo] = await Promise.all([
          getHistory(),
          getSummary(),
        ]);

        setPartidas(historico);
        setSummary(resumo);
      } catch (error) {
        console.error(
          "Erro ao carregar dashboard:",
          error,
        );
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
          <Speakable
            as="p"
            text="Carregando dashboard. Aguarde."
          >
            <p>Carregando...</p>
          </Speakable>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.topo}>
        <Speakable
          as="h1"
          text="Dashboard. Acompanhe seu desempenho nos jogos."
        >
          <h1 className={styles.titulo}>
            Dashboard
          </h1>
        </Speakable>

        <Speakable
          as="span"
          text="Voltar para a página inicial."
        >
          <Link
            to="/"
            className={styles.voltarLink}
          >
            ← Voltar
          </Link>
        </Speakable>
      </div>

      <Speakable
        as="div"
        text={`Gráfico radar de desempenho cognitivo. Memória: ${summary.memoria} pontos. Atenção: ${summary.atencao} pontos. Velocidade: ${summary.velocidade} pontos. Lógica: ${summary.logica} pontos.`}
      >
        <div
          className={styles.grafico}
          role="img"
          aria-label={`Gráfico radar de desempenho cognitivo. Memória: ${summary.memoria} pontos. Atenção: ${summary.atencao} pontos. Velocidade: ${summary.velocidade} pontos. Lógica: ${summary.logica} pontos.`}
        >
          <CognitiveRadar summary={summary} />
        </div>
      </Speakable>

      <section className={styles.secao}>
        <Speakable
          as="h2"
          text="Resumo por jogo."
        >
          <h2 className={styles.subtitulo}>
            Resumo por jogo
          </h2>
        </Speakable>

        {Object.keys(mediasPorJogo).length === 0 ? (
          <Speakable
            as="div"
            text="Você ainda não possui partidas registradas."
          >
            <div className={styles.semPartidas}>
              <p>
                Você ainda não possui partidas
                registradas.
              </p>
            </div>
          </Speakable>
        ) : (
          <div className={styles.resumoGrid}>
            {Object.entries(mediasPorJogo).map(
              ([gameId, media]) => (
                <Speakable
                  key={gameId}
                  as="article"
                  text={`${formatarNomeJogo(gameId)}. Total de partidas: ${media.totalPartidas}. Score médio: ${formatarMediaScore(gameId, media.mediaScore)}. ${media.metrica.label}: ${media.metrica.format(media.mediaMetrica)}.`}
                >
                  <article
                    className={styles.cardJogo}
                  >
                    <h3
                      className={styles.nomeJogo}
                    >
                      {formatarNomeJogo(gameId)}
                    </h3>

                    <div
                      className={styles.estatisticas}
                    >
                      <div
                        className={
                          styles.estatistica
                        }
                      >
                        <span
                          className={styles.label}
                        >
                          Total de partidas
                        </span>

                        <span
                          className={styles.valor}
                        >
                          {media.totalPartidas}
                        </span>
                      </div>

                      <div
                        className={
                          styles.estatistica
                        }
                      >
                        <span
                          className={styles.label}
                        >
                          Score médio
                        </span>

                        <span
                          className={styles.valor}
                        >
                          {formatarMediaScore(
                            gameId,
                            media.mediaScore,
                          )}
                        </span>
                      </div>

                      <div
                        className={
                          styles.estatistica
                        }
                      >
                        <span
                          className={styles.label}
                        >
                          {media.metrica.label}
                        </span>

                        <span
                          className={styles.valor}
                        >
                          {media.metrica.format(
                            media.mediaMetrica,
                          )}
                        </span>
                      </div>
                    </div>
                  </article>
                </Speakable>
              ),
            )}
          </div>
        )}
      </section>

      <section className={styles.secao}>
        <Speakable
          as="h2"
          text="Histórico de partidas."
        >
          <h2 className={styles.subtitulo}>
            Histórico de partidas
          </h2>
        </Speakable>

        {partidas.length === 0 ? (
          <Speakable
            as="div"
            text="Nenhuma partida encontrada."
          >
            <div className={styles.semPartidas}>
              <p>Nenhuma partida encontrada.</p>
            </div>
          </Speakable>
        ) : (
          <div className={styles.historico}>
            {partidas.map((partida) => {
              const metrica = metricaPrincipal(
                partida.gameId,
              );

              const nomeJogo = formatarNomeJogo(
                partida.gameId,
              );

              const score = formatarScore(
                partida.gameId,
                partida.score,
              );

              const valorMetrica =
                metrica.format(
                  partida[metrica.key],
                );

              const data = formatarData(
                partida.playedAt,
              );

              return (
                <Speakable
                  key={partida.id}
                  as="article"
                  text={`${nomeJogo}. Data da partida: ${data}. Score: ${score}. ${metrica.partidaLabel}: ${valorMetrica}.`}
                >
                  <article
                    className={styles.partida}
                  >
                    <div
                      className={
                        styles.infoPartida
                      }
                    >
                      <p
                        className={styles.jogo}
                      >
                        {nomeJogo}
                      </p>

                      <p
                        className={styles.data}
                      >
                        {data}
                      </p>
                    </div>

                    <div
                      className={
                        styles.resultado
                      }
                    >
                      <div
                        className={
                          styles.resultadoItem
                        }
                      >
                        <span
                          className={
                            styles.resultadoLabel
                          }
                        >
                          Score
                        </span>

                        <span
                          className={
                            styles.resultadoValor
                          }
                        >
                          {score}
                        </span>
                      </div>

                      <div
                        className={
                          styles.resultadoItem
                        }
                      >
                        <span
                          className={
                            styles.resultadoLabel
                          }
                        >
                          {metrica.partidaLabel}
                        </span>

                        <span
                          className={
                            styles.resultadoValor
                          }
                        >
                          {valorMetrica}
                        </span>
                      </div>
                    </div>
                  </article>
                </Speakable>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}