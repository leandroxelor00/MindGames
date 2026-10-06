import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { gamesRegistry } from "../games/registry";
import { useAuth } from "../hooks/useAuth";
import {
  getDailyChallenge,
  getStreak,
} from "../services/scoreService";
import { logout } from "../services/authService";
import { getGlobalRanking } from "../services/rankingService";
import { RankingList } from "../components/RankingList/RankingList";
import { RankingModal } from "../components/RankingModal/RankingModal";
import { Speakable } from "../components/Speakable/Speakable";
import { useAccessibility } from "../context/AccessibilityContext";

import styles from "./Home.module.css";

export function Home() {
  const { user, setUser } = useAuth();

  const {
    vozNarrador,
    alternarNarrador,
  } = useAccessibility();

  const [streak, setStreak] = useState(0);
  const [dailyChallenge, setDailyChallenge] = useState([]);
  const [topRanking, setTopRanking] = useState(null);
  const [rankingError, setRankingError] = useState(false);
  const [rankingAberto, setRankingAberto] = useState(false);

  useEffect(() => {
    async function loadHomeData() {
      const [streakResult, challengeResult] = await Promise.allSettled([
        getStreak(),
        getDailyChallenge(),
      ]);

      if (streakResult.status === "fulfilled") {
        setStreak(streakResult.value);
      }

      if (challengeResult.status === "fulfilled") {
        setDailyChallenge(challengeResult.value);
      }
    }

    loadHomeData();
  }, []);

  useEffect(() => {
    getGlobalRanking(5)
      .then((result) => setTopRanking(result.ranking))
      .catch(() => setRankingError(true));
  }, []);

  function handleLogout() {
    logout();
    setUser(null);
  }

  function handleNarrador() {
    alternarNarrador();
  }

  return (
    <div className={styles.page}>
      <nav className={styles.navbar}>
        <Speakable
          as="span"
          text="MindGames"
        >
          <span className={styles.brand}>
            MindGames
          </span>
        </Speakable>

        <div className={styles.navActions}>
          <Speakable
            as="span"
            text="Ver meu histórico"
          >
            <Link
              to="/dashboard"
              className={styles.navLink}
            >
              Ver meu histórico
            </Link>
          </Speakable>

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
                vozNarrador
                  ? "Desativar narrador"
                  : "Ativar narrador"
              }
              title={
                vozNarrador
                  ? "Desativar narrador"
                  : "Ativar narrador"
              }
            >
              <span aria-hidden="true">
                ♿
              </span>

              <span>
                {vozNarrador
                  ? "Narrador ativado"
                  : "Ativar narrador"}
              </span>
            </button>
          </Speakable>

          {user ? (
            <div className={styles.navUser}>
              <Speakable
                as="span"
                text={`Olá, ${user.username ?? user.email}`}
              >
                <span className={styles.navEmail}>
                  Olá,{" "}
                  <strong>
                    {user.username ?? user.email}
                  </strong>
                </span>
              </Speakable>

              <Speakable
                as="span"
                text="Sair"
              >
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
              <Speakable
                as="span"
                text="Entrar"
              >
                <Link
                  to="/login"
                  className={styles.navLink}
                >
                  Entrar
                </Link>
              </Speakable>

              <Speakable
                as="span"
                text="Criar conta"
              >
                <Link
                  to="/register"
                  className={styles.navButtonPrimary}
                >
                  Criar conta
                </Link>
              </Speakable>
            </>
          )}

          <Speakable
            as="span"
            text="Configurações"
          >
            <Link
              to="/settings"
              className={styles.navLink}
            >
              Configurações
            </Link>
          </Speakable>
        </div>
      </nav>

      <header className={styles.hero}>
        <Speakable
          as="span"
          text="Treine sua mente com ciência."
        >
          <h1 className={styles.headline}>
            Treine sua mente com ciência.
          </h1>
        </Speakable>

        <Speakable
          as="span"
          text="Jogos curtos que medem atenção, memória e tempo de reação. Acompanhe sua evolução partida após partida."
        >
          <p className={styles.subtitle}>
            Jogos curtos que medem atenção, memória e
            tempo de reação — acompanhe sua evolução
            partida após partida.
          </p>
        </Speakable>
      </header>

      <div className={styles.homeContent}>
        <main>
          <section>
            <Speakable
              as="span"
              text="Escolha um jogo"
            >
              <h2 className={styles.sectionLabel}>
                Escolha um jogo
              </h2>
            </Speakable>

            <div className={styles.cardsContainer}>
              {gamesRegistry.map((registry) => (
                <Speakable
                  key={registry.id}
                  as="span"
                  text={`${registry.name}. Jogo disponível no MindGames.`}
                >
                  <Link
                    className={styles.link}
                    to={`/game/${registry.id}`}
                  >
                    <div className={styles.card}>
                      <span className={styles.cardName}>
                        {registry.name}
                      </span>
                    </div>
                  </Link>
                </Speakable>
              ))}
            </div>
          </section>
        </main>

        <aside className={styles.dailyAside}>
          <Speakable
            as="span"
            text={`Seu streak: ${streak} dias`}
          >
            <div className={styles.streakCard}>
              <span
                className={styles.streakIcon}
                aria-hidden="true"
              >
                🔥
              </span>

              <div>
                <span className={styles.streakLabel}>
                  Seu streak
                </span>

                <strong className={styles.streakNumber}>
                  {streak} dias
                </strong>
              </div>
            </div>
          </Speakable>

          <section className={styles.challengeCard}>
            <Speakable
              as="span"
              text="Desafio do dia. Sua seleção de hoje."
            >
              <div>
                <span className={styles.challengeEyebrow}>
                  DESAFIO DO DIA
                </span>

                <h2 className={styles.challengeTitle}>
                  Sua seleção de hoje
                </h2>
              </div>
            </Speakable>

            <div className={styles.challengeGames}>
              {dailyChallenge.map((gameId) => {
                const game = gamesRegistry.find(
                  (registry) =>
                    registry.id === gameId,
                );

                return (
                  <Speakable
                    key={gameId}
                    as="span"
                    text={`${game?.name ?? gameId}. Desafio do dia.`}
                  >
                    <Link
                      to={`/game/${gameId}`}
                      className={styles.challengeGame}
                    >
                      <span>
                        {game?.name ?? gameId}
                      </span>

                      <span
                        className={
                          styles.challengeArrow
                        }
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </Link>
                  </Speakable>
                );
              })}
            </div>
          </section>

          <section className={styles.rankingCard}>
            <Speakable
              as="span"
              text="Ranking. Top jogadores."
            >
              <div>
                <span
                  className={
                    styles.challengeEyebrow
                  }
                >
                  RANKING
                </span>

                <h2
                  className={
                    styles.challengeTitle
                  }
                >
                  Top jogadores
                </h2>
              </div>
            </Speakable>

            {rankingError && (
              <Speakable
                as="span"
                text="Não foi possível carregar o ranking."
              >
                <p
                  className={
                    styles.rankingMessage
                  }
                >
                  Não foi possível carregar o
                  ranking.
                </p>
              </Speakable>
            )}

            {!rankingError &&
              topRanking === null && (
                <Speakable
                  as="span"
                  text="Carregando ranking."
                >
                  <p
                    className={
                      styles.rankingMessage
                    }
                  >
                    Carregando...
                  </p>
                </Speakable>
              )}

            {topRanking && (
              <RankingList
                items={topRanking}
                usernameAtual={
                  user?.username ?? null
                }
                mostrarPartidas={false}
              />
            )}

            <Speakable
              as="span"
              text="Ver ranking completo"
            >
              <button
                type="button"
                className={styles.rankingButton}
                onClick={() =>
                  setRankingAberto(true)
                }
              >
                Ver ranking completo
              </button>
            </Speakable>
          </section>
        </aside>
      </div>

      <RankingModal
        aberto={rankingAberto}
        onFechar={() =>
          setRankingAberto(false)
        }
      />
    </div>
  );
}