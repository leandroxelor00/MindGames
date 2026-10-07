import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getHistory, getSummary } from "../services/scoreService";
import { CognitiveRadar } from "../components/CognitiveRadar/CognitiveRadar";
import { Speakable } from "../components/Speakable/Speakable";
import { useNotification } from "../context/NotificationContext";
import { gamesRegistry } from "../games/registry";
import { games } from "../config/gamesConfig";

import styles from "./Dashboard.module.css";

const CATEGORY_META = {
  memory: { label: "Memória", icon: "🧠" },
  attention: { label: "Atenção", icon: "🎯" },
  velocity: { label: "Velocidade", icon: "⚡" },
  logic: { label: "Lógica", icon: "🔢" },
};

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
  const gameIds = [...new Set(partidas.map((partida) => partida.gameId))];
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
      (total, partida) => total + (Number(partida[metrica.key]) || 0),
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
  const jogo = gamesRegistry.find((game) => game.id === gameId);
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
  const dataCorrigida = playedAt.includes(" ")
    ? playedAt.replace(" ", "T") + "Z"
    : playedAt;
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
  const { notificar } = useNotification();
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
        console.error("Erro ao carregar dashboard:", error);
        notificar("Não foi possível carregar seu histórico. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }

    carregarHistorico();
  }, [notificar]);

  const mediasPorJogo = calcularMediasPorJogo(partidas);

  const resumoCategorias = [
    { key: "memoria", ...CATEGORY_META.memory, valor: summary.memoria },
    { key: "atencao", ...CATEGORY_META.attention, valor: summary.atencao },
    {
      key: "velocidade",
      ...CATEGORY_META.velocity,
      valor: summary.velocidade,
    },
    { key: "logica", ...CATEGORY_META.logic, valor: summary.logica },
  ]; 

  if (loading) {
    return (
      <main className={styles.container}>
        <div className={styles.carregando}>
          <span className={styles.loadingIcon} aria-hidden="true">◌</span>
          <Speakable as="p" text="Carregando dashboard. Aguarde.">
            <p>Carregando seu desempenho...</p>
          </Speakable>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <header className={styles.topo}>
        <div>
          <span className={styles.eyebrow}>SEU DESEMPENHO</span>
          <Speakable as="h1" text="Dashboard. Acompanhe seu desempenho nos jogos.">
            <h1 className={styles.titulo}>Dashboard</h1>
          </Speakable>
          <p className={styles.intro}>
            Veja como você está evoluindo e acompanhe seu histórico de partidas.
          </p>
        </div>

        <Speakable as="span" text="Voltar para a página inicial.">
          <Link to="/" className={styles.voltarLink}>
            ← Voltar para a Home
          </Link>
        </Speakable>
      </header>

      <section className={styles.miniResumo} aria-label="Resumo por categoria">
        {resumoCategorias.map((categoria) => (
          <article key={categoria.key} className={styles.resumoCategoria}>
            <div className={styles.resumoCategoriaTop}>
              <span className={styles.resumoIcon} aria-hidden="true">
                {categoria.icon}
              </span>
              <span className={styles.resumoCategoriaNome}>{categoria.label}</span>
            </div>
            <strong className={styles.resumoCategoriaValor}>
              {Math.round(Number(categoria.valor) || 0)}%
            </strong>
          </article>
        ))}
      </section>

      <section className={styles.radarPanel}>
        <div className={styles.painelCabecalho}>
          <div>
            <span className={styles.eyebrow}>VISÃO GERAL</span>
            <h2 className={styles.subtitulo}>Seu perfil cognitivo</h2>
          </div>
          <span className={styles.painelHint}>Escala de 0 a 100</span>
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
      </section>

      <section className={styles.secao}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.eyebrow}>PARTIDAS</span>
            <Speakable as="h2" text="Resumo por jogo.">
              <h2 className={styles.subtitulo}>Resumo por jogo</h2>
            </Speakable>
          </div>
          <span className={styles.sectionHint}>
            {Object.keys(mediasPorJogo).length} jogo(s) praticado(s)
          </span>
        </div>

        {Object.keys(mediasPorJogo).length === 0 ? (
          <Speakable as="div" text="Você ainda não possui partidas registradas.">
            <div className={styles.semPartidas}>
              <span aria-hidden="true">🎮</span>
              <p>Você ainda não possui partidas registradas.</p>
              <Link to="/" className={styles.emptyLink}>Escolher um jogo</Link>
            </div>
          </Speakable>
        ) : (
          <div className={styles.resumoGrid}>
            {Object.entries(mediasPorJogo).map(([gameId, media]) => {
              const categoryKey = games[gameId]?.category ?? "memory";
              const categoryMeta = CATEGORY_META[categoryKey];

              return (
                <Speakable
                  key={gameId}
                  as="article"
                  text={`${formatarNomeJogo(gameId)}. Categoria ${categoryMeta?.label ?? "Memória"}. Total de partidas: ${media.totalPartidas}. Score médio: ${formatarMediaScore(gameId, media.mediaScore)}. ${media.metrica.label}: ${media.metrica.format(media.mediaMetrica)}.`}
                >
                  <article className={styles.cardJogo}>
                    <div className={styles.cardJogoTop}>
                      <span className={styles.cardIcon} aria-hidden="true">
                        {categoryMeta?.icon ?? "🧠"}
                      </span>
                      <span
                        className={styles.cardCategoria}
                        data-category={categoryKey}
                      >
                        {categoryMeta?.label ?? "Memória"}
                      </span>
                    </div>

                    <h3 className={styles.nomeJogo}>{formatarNomeJogo(gameId)}</h3>

                    <div className={styles.estatisticas}>
                      <div className={styles.estatistica}>
                        <span className={styles.label}>Partidas</span>
                        <strong className={styles.valor}>{media.totalPartidas}</strong>
                      </div>

                      <div className={styles.estatistica}>
                        <span className={styles.label}>Score médio</span>
                        <strong className={styles.valor}>
                          {formatarMediaScore(gameId, media.mediaScore)}
                        </strong>
                      </div>

                      <div className={styles.estatistica}>
                        <span className={styles.label}>{media.metrica.label}</span>
                        <strong className={styles.valor}>
                          {media.metrica.format(media.mediaMetrica)}
                        </strong>
                      </div>
                    </div>
                  </article>
                </Speakable>
              );
            })}
          </div>
        )}
      </section>

      <section className={styles.secao}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.eyebrow}>HISTÓRICO</span>
            <Speakable as="h2" text="Histórico de partidas.">
              <h2 className={styles.subtitulo}>Últimas partidas</h2>
            </Speakable>
          </div>
          <span className={styles.sectionHint}>{partidas.length} registro(s)</span>
        </div>

        {partidas.length === 0 ? (
          <Speakable as="div" text="Nenhuma partida encontrada.">
            <div className={styles.semPartidas}>
              <span aria-hidden="true">🕘</span>
              <p>Nenhuma partida encontrada.</p>
            </div>
          </Speakable>
        ) : (
          <div className={styles.historico}>
            {partidas.map((partida) => {
              const metrica = metricaPrincipal(partida.gameId);
              const nomeJogo = formatarNomeJogo(partida.gameId);
              const score = formatarScore(partida.gameId, partida.score);
              const valorMetrica = metrica.format(partida[metrica.key]);
              const data = formatarData(partida.playedAt);
              const categoryKey = games[partida.gameId]?.category ?? "memory";
              const categoryMeta = CATEGORY_META[categoryKey];

              return (
                <Speakable
                  key={partida.id}
                  as="article"
                  text={`${nomeJogo}. Categoria ${categoryMeta?.label ?? "Memória"}. Data da partida: ${data}. Score: ${score}. ${metrica.partidaLabel}: ${valorMetrica}.`}
                >
                  <article className={styles.partida}>
                    <div className={styles.infoPartida}>
                      <div className={styles.historicoNomeLinha}>
                        <span className={styles.historicoIcon} aria-hidden="true">
                          {categoryMeta?.icon ?? "🧠"}
                        </span>
                        <div>
                          <p className={styles.jogo}>{nomeJogo}</p>
                          <p className={styles.data}>{data}</p>
                        </div>
                      </div>
                    </div>

                    <div className={styles.resultado}>
                      <div className={styles.resultadoItem}>
                        <span className={styles.resultadoLabel}>Score</span>
                        <strong className={styles.resultadoValor}>{score}</strong>
                      </div>

                      <div className={styles.resultadoItem}>
                        <span className={styles.resultadoLabel}>{metrica.partidaLabel}</span>
                        <strong className={styles.resultadoValor}>{valorMetrica}</strong>
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
