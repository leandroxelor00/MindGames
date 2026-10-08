import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { gamesRegistry } from "../games/registry";
import { games } from "../config/gamesConfig";
import { useAuth } from "../hooks/useAuth";
import {
  getDailyChallenge,
  getHistory,
  getStreak,
} from "../services/scoreService";
import { logout } from "../services/authService";
import { getGlobalRanking } from "../services/rankingService";
import { RankingList } from "../components/RankingList/RankingList";
import { RankingModal } from "../components/RankingModal/RankingModal";
import { Speakable } from "../components/Speakable/Speakable";
import { useAccessibility } from "../context/AccessibilityContext";
import { useTheme } from "../context/ThemeContext";
import { ThemeSwitcher } from "../components/ThemeSwitcher/ThemeSwitcher";
import { SeasonGhost } from "../components/ThemeSwitcher/SeasonGhost";
import halloweenBanner from "../assets/halloween-banner.jpg";

import styles from "./Home.module.css";

const CATEGORY_LABELS = {
  memory: "Memória",
  attention: "Atenção",
  velocity: "Velocidade",
  logic: "Lógica",
};

const GAME_ICONS = {
  "memory-match": "🧠",
  "stroop-test": "🎨",
  "number-challenge": "🔢",
  "priority-tower": "🗼",
  "visual-memory": "👁️",
  "food-memory": "🍎",
  "reaction-time": "⚡",
  "sound-sequence": "🔊",
};

function parsePlayedAt(value) {
  if (!value) return null;

  if (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)
  ) {
    return new Date(value.replace(" ", "T") + "Z");
  }

  return new Date(value);
}

function getSaoPauloDate(value) {
  const date = parsePlayedAt(value);

  if (!date || Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getTodaySaoPaulo() {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function buildGameStats(history) {
  return history.reduce((acc, result) => {
    if (!result?.gameId) return acc;

    const current = acc[result.gameId] ?? {
      partidas: 0,
      melhorResultado: null,
    };

    current.partidas += 1;

    const value = Number(result.score);

    if (Number.isFinite(value)) {
      const isReactionTime = result.gameId === "reaction-time";

      if (
        current.melhorResultado === null ||
        (isReactionTime
          ? value < current.melhorResultado
          : value > current.melhorResultado)
      ) {
        current.melhorResultado = value;
      }
    }

    acc[result.gameId] = current;
    return acc;
  }, {});
}

function formatBestResult(gameId, value) {
  if (value === null) return null;

  if (gameId === "reaction-time") {
    return `${Math.round(value)} ms`;
  }

  return `${Math.round(value)} pts`;
}

export function Home() {
  const { user, setUser } = useAuth();

  const { vozNarrador, alternarNarrador, altoContraste } =
    useAccessibility();
  const { theme } = useTheme();
  const seasonal = theme !== "original";

  const [streak, setStreak] = useState(0);
  const [dailyChallenge, setDailyChallenge] = useState([]);
  const [history, setHistory] = useState([]);
  const [topRanking, setTopRanking] = useState(null);
  const [rankingError, setRankingError] = useState(false);
  const [rankingAberto, setRankingAberto] = useState(false);

  useEffect(() => {
    async function loadHomeData() {
      const [streakResult, challengeResult, historyResult] =
        await Promise.allSettled([
          getStreak(),
          getDailyChallenge(),
          getHistory(),
        ]);

      if (streakResult.status === "fulfilled") {
        setStreak(streakResult.value);
      }

      if (challengeResult.status === "fulfilled") {
        setDailyChallenge(challengeResult.value);
      }

      if (historyResult.status === "fulfilled") {
        setHistory(historyResult.value);
      }
    }

    loadHomeData();
  }, []);

  useEffect(() => {
    getGlobalRanking(5)
      .then((result) => setTopRanking(result.ranking))
      .catch(() => setRankingError(true));
  }, []);

  const gameStats = buildGameStats(history);
  const today = getTodaySaoPaulo();
  const playedToday = new Set(
    history
      .filter((result) => getSaoPauloDate(result?.playedAt) === today)
      .map((result) => result.gameId),
  );

  function handleLogout() {
    logout();
    setUser(null);
  }

  function handleNarrador() {
    alternarNarrador();
  }

  return (
    <div className={styles.page}>
      <header className={styles.siteHeader}>
        <nav className={styles.headerInner} aria-label="Navegação principal">
          <Speakable as="span" text="MindGames">
            <Link to="/" className={styles.brandLink}>
              <svg
                className={styles.brandIcon}
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
                <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
                <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
                <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
                <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
              </svg>
              <span className={styles.brand}>MindGames</span>
            </Link>
          </Speakable>

          <div className={styles.navCenter}>
            <Speakable as="span" text="Início">
              <Link
                to="/"
                className={`${styles.navLink} ${styles.navLinkActive}`}
                aria-current="page"
              >
                Início
              </Link>
            </Speakable>

            <Speakable as="span" text="Meu histórico">
              <Link to="/dashboard" className={styles.navLink}>
                Meu histórico
              </Link>
            </Speakable>
          </div>

          <div className={styles.navActions}>
            <Speakable
              as="span"
              text={
                vozNarrador
                  ? "Narrador ativado. Botão para desativar o narrador."
                  : "Narrador desativado. Botão para ativar o narrador."
              }
            >
              <button
                type="button"
                className={styles.accessibilityButton}
                onClick={handleNarrador}
                aria-pressed={vozNarrador}
                aria-label={
                  vozNarrador ? "Desativar narrador" : "Ativar narrador"
                }
                title={vozNarrador ? "Desativar narrador" : "Ativar narrador"}
              >
                <span aria-hidden="true">♿</span>
                <span className={styles.accessibilityText}>
                  {vozNarrador ? "Narrador ativado" : "Ativar narrador"}
                </span>
              </button>
            </Speakable>

            <Speakable as="span" text="Configurações">
              <Link
                to="/settings"
                className={styles.settingsLink}
                aria-label="Configurações"
                title="Configurações"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M20 7h-9" />
                  <path d="M14 17H5" />
                  <circle cx="17" cy="17" r="3" />
                  <circle cx="7" cy="7" r="3" />
                </svg>
              </Link>
            </Speakable>

            {user ? (
              <div className={styles.navUser}>
                <Speakable
                  as="span"
                  text={`Olá, ${user.username ?? "Jogador"}`}
                >
                  <span className={styles.navUsername}>
                    Olá, <strong>{user.username ?? "Jogador"}</strong>
                  </span>
                </Speakable>

                <Speakable as="span" text="Sair">
                  <button
                    type="button"
                    className={styles.navButtonGhost}
                    onClick={handleLogout}
                  >
                    Sair
                  </button>
                </Speakable>
              </div>
            ) : (
              <>
                <Speakable as="span" text="Entrar">
                  <Link to="/login" className={styles.navLinkEntrar}>
                    Entrar
                  </Link>
                </Speakable>

                <Speakable as="span" text="Criar conta">
                  <Link to="/register" className={styles.navButtonPrimary}>
                    Criar conta <span aria-hidden="true">↗</span>
                  </Link>
                </Speakable>
              </>
            )}
          </div>
        </nav>
      </header>

      <ThemeSwitcher />

      <header
        className={`${styles.hero} ${
          theme === "halloween" && !altoContraste ? styles.heroComImagem : ""
        }`}
      >
        {theme === "halloween" && !altoContraste && (
          <img
            className={styles.heroImage}
            src={halloweenBanner}
            alt=""
            width={1536}
            height={640}
          />
        )}

        {theme === "subtle" && !altoContraste && (
          <SeasonGhost className={styles.heroGhost} size={100} />
        )}

        <div className={styles.heroCopy}>
          <span className={styles.heroEyebrow}>
            {seasonal
              ? "MENTES CURIOSAS. DESAFIOS ARREPIANTES."
              : "MINDGAMES"}
          </span>

          <Speakable as="span" text="Treine sua mente com ciência.">
            <h1 className={styles.headline}>Treine sua mente com ciência.</h1>
          </Speakable>

          <Speakable
            as="span"
            text="Jogos curtos que medem atenção, memória e tempo de reação. Acompanhe sua evolução partida após partida."
          >
            <p className={styles.subtitle}>
              Jogos curtos que medem atenção, memória e tempo de reação —
              acompanhe sua evolução partida após partida.
            </p>
          </Speakable>
        </div>
      </header>

      <div className={styles.homeContent}>
        <aside className={styles.dailySummary}>
          <Speakable as="span" text={`Seu streak: ${streak} dias`}>
            <div className={styles.streakCard}>
              <span className={styles.streakIcon} aria-hidden="true">
                🔥
              </span>

              <div>
                <span className={styles.streakLabel}>Seu streak</span>
                <strong className={styles.streakNumber}>{streak} dias</strong>
              </div>
            </div>
          </Speakable>

          <section className={styles.challengeCard}>
            <Speakable
              as="span"
              text="Desafio do dia. Sua seleção de hoje."
            >
              <div>
                <span className={styles.challengeEyebrow}>DESAFIO DO DIA</span>
                <h2 className={styles.challengeTitle}>Sua seleção de hoje</h2>
              </div>
            </Speakable>

            {dailyChallenge.length === 0 ? (
              <div className={styles.emptyState}>
                <span aria-hidden="true">📅</span>
                <p>Desafio indisponível no momento.</p>
              </div>
            ) : (
              <div className={styles.challengeGames}>
                {dailyChallenge.map((gameId) => {
                  const game = gamesRegistry.find(
                    (registry) => registry.id === gameId,
                  );
                  const completed = playedToday.has(gameId);

                  return (
                    <Speakable
                      key={gameId}
                      as="span"
                      text={`${game?.name ?? gameId}. ${
                        completed
                          ? "Concluído hoje."
                          : "Ainda não jogado hoje."
                      }`}
                    >
                      <Link to={`/game/${gameId}`} className={styles.challengeGame}>
                        <span className={styles.challengeGameName}>
                          {game?.name ?? gameId}
                        </span>

                        {completed ? (
                          <span
                            className={styles.challengeCheck}
                            aria-label="Concluído hoje"
                          >
                            ✓
                          </span>
                        ) : (
                          <span className={styles.challengeArrow} aria-hidden="true">
                            →
                          </span>
                        )}
                      </Link>
                    </Speakable>
                  );
                })}
              </div>
            )}
          </section>

          {seasonal && (
            <div className={styles.seasonNote}>
              <div className={styles.seasonNoteHead}>
                <span aria-hidden="true">👻</span>
                Bons sustos, bons treinos.
              </div>
              <p>Neste Halloween, dê um susto na sua zona de conforto.</p>
            </div>
          )}
        </aside>

        <main className={styles.gamesArea}>
          <section>
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.sectionEyebrow}>TREINO</span>
                <Speakable as="span" text="Escolha um jogo">
                  <h2 className={styles.sectionTitle}>Escolha um jogo</h2>
                </Speakable>
              </div>
              <span className={styles.gameCount}>
                {gamesRegistry.length} jogos
              </span>
            </div>

            <div className={styles.gamesGrid}>
              {gamesRegistry.map((registry) => {
                const categoryKey = games[registry.id]?.category ?? "memory";
                const category = CATEGORY_LABELS[categoryKey] ?? "Memória";
                const stats = gameStats[registry.id];
                const bestResult = formatBestResult(
                  registry.id,
                  stats?.melhorResultado ?? null,
                );

                return (
                  <Speakable
                    key={registry.id}
                    as="span"
                    text={`${registry.name}. Categoria ${category}. ${
                      stats?.partidas
                        ? `${stats.partidas} partidas realizadas.`
                        : "Ainda não jogado."
                    }`}
                  >
                    <Link className={styles.link} to={`/game/${registry.id}`}>
                      <article className={styles.card}>
                        <div className={styles.gameTop}>
                          <span className={styles.gameIcon} aria-hidden="true">
                            {GAME_ICONS[registry.id] ?? "🎯"}
                          </span>
                          <span
                            className={styles.categoryTag}
                            data-category={categoryKey}
                          >
                            {category}
                          </span>
                        </div>

                        <div className={styles.gameBody}>
                          <h3 className={styles.gameName}>{registry.name}</h3>

                          <p className={styles.gameDescription}>
                            {registry.description}
                          </p>
                        </div>

                        <div className={styles.gameFooter}>
                          {stats?.partidas ? (
                            <>
                              <span>{stats.partidas} {stats.partidas === 1 ? "partida" : "partidas"}</span>
                              {bestResult && <span>Melhor: {bestResult}</span>}
                            </>
                          ) : (
                            <span className={styles.notPlayed}>○ Ainda não jogado</span>
                          )}
                          <span className={styles.gameArrow} aria-hidden="true">
                            →
                          </span>
                        </div>
                      </article>
                    </Link>
                  </Speakable>
                );
              })}
            </div>
          </section>
        </main>

        <section className={styles.rankingCard}>
          <Speakable as="span" text="Ranking. Top jogadores.">
            <div>
              <span className={styles.challengeEyebrow}>RANKING</span>
              <h2 className={styles.challengeTitle}>Top jogadores</h2>
            </div>
          </Speakable>

          {rankingError && (
            <div className={styles.emptyState}>
              <span aria-hidden="true">⚠️</span>
              <p>Ranking indisponível no momento.</p>
            </div>
          )}

          {!rankingError && topRanking === null && (
            <div className={styles.emptyState} aria-live="polite">
              <span aria-hidden="true">⏳</span>
              <p>Carregando ranking...</p>
            </div>
          )}

          {topRanking && (
            <RankingList
              items={topRanking}
              usernameAtual={user?.username ?? null}
              mostrarPartidas={true}
            />
          )}

          <Speakable as="span" text="Ver ranking completo">
            <button
              type="button"
              className={styles.rankingButton}
              onClick={() => setRankingAberto(true)}
            >
              Ver ranking completo
            </button>
          </Speakable>
        </section>
      </div>

      <RankingModal
        aberto={rankingAberto}
        onFechar={() => setRankingAberto(false)}
      />
    </div>
  );
}
