import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { gamesRegistry } from "../games/registry";
import { useAuth } from "../hooks/useAuth";
import { getDailyChallenge, getStreak } from "../services/scoreService";
import { logout } from "../services/authService";
import { getGlobalRanking } from "../services/rankingService";
import { RankingList } from "../components/RankingList/RankingList";
import { RankingModal } from "../components/RankingModal/RankingModal";

import styles from "./Home.module.css";

export function Home() {
  const { user, setUser } = useAuth();

  const [streak, setStreak] = useState(0);
  const [dailyChallenge, setDailyChallenge] = useState([]);
  const [topRanking, setTopRanking] = useState(null);
  const [rankingError, setRankingError] = useState(false);
  const [rankingAberto, setRankingAberto] = useState(false);

  useEffect(() => {
    async function loadHomeData() {
      const streakResult = await getStreak();
      const challengeResult = await getDailyChallenge();

      setStreak(streakResult);
      setDailyChallenge(challengeResult);
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

  return (
    <div className={styles.page}>
      <nav className={styles.navbar}>
        <span className={styles.brand}>MindGames</span>

        <div className={styles.navActions}>
          <Link to="/dashboard" className={styles.navLink}>
            Ver meu histórico
          </Link>

          {user ? (
            <div className={styles.navUser}>
              <span className={styles.navEmail}>
                Olá, <strong>{user.username ?? user.email}</strong>
              </span>

              <button className={styles.navButtonGhost} onClick={handleLogout}>
                Sair
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className={styles.navLink}>
                Entrar
              </Link>

              <Link to="/register" className={styles.navButtonPrimary}>
                Criar conta
              </Link>
            </>
          )}
          <Link to="/settings" className={styles.navLink}>
            Configurações
          </Link>
        </div>
      </nav>

      <header className={styles.hero}>
        <h1 className={styles.headline}>Treine sua mente com ciência.</h1>

        <p className={styles.subtitle}>
          Jogos curtos que medem atenção, memória e tempo de reação — acompanhe
          sua evolução partida após partida.
        </p>
      </header>

      <div className={styles.homeContent}>
        <main>
          {/* Escolha um jogo */}
          <section>
            <h2 className={styles.sectionLabel}>Escolha um jogo</h2>

            <div className={styles.cardsContainer}>
              {gamesRegistry.map((registry) => (
                <Link
                  className={styles.link}
                  key={registry.id}
                  to={`/game/${registry.id}`}
                >
                  <div className={styles.card}>
                    <span className={styles.cardName}>{registry.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </main>

        {/* Streak e daily challenge */}
        <aside className={styles.dailyAside}>
          <div className={styles.streakCard}>
            <span className={styles.streakIcon}>🔥</span>

            <div>
              <span className={styles.streakLabel}>Seu streak</span>
              <strong className={styles.streakNumber}>{streak} dias</strong>
            </div>
          </div>

          <section className={styles.challengeCard}>
            <span className={styles.challengeEyebrow}>DESAFIO DO DIA</span>

            <h2 className={styles.challengeTitle}>Sua seleção de hoje</h2>

            <div className={styles.challengeGames}>
              {dailyChallenge.map((gameId) => {
                const game = gamesRegistry.find(
                  (registry) => registry.id === gameId,
                );

                return (
                  <Link
                    key={gameId}
                    to={`/game/${gameId}`}
                    className={styles.challengeGame}
                  >
                    <span>{game?.name ?? gameId}</span>
                    <span className={styles.challengeArrow}>→</span>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className={styles.rankingCard}>
            <span className={styles.challengeEyebrow}>RANKING</span>

            <h2 className={styles.challengeTitle}>Top jogadores</h2>

            {rankingError && (
              <p className={styles.rankingMessage}>
                Não foi possível carregar o ranking.
              </p>
            )}

            {!rankingError && topRanking === null && (
              <p className={styles.rankingMessage}>Carregando...</p>
            )}

            {topRanking && (
              <RankingList
                items={topRanking}
                usernameAtual={user?.username ?? null}
                mostrarPartidas={false}
              />
            )}

            <button
              type="button"
              className={styles.rankingButton}
              onClick={() => setRankingAberto(true)}
            >
              Ver ranking completo
            </button>
          </section>
        </aside>
      </div>

      <RankingModal
        aberto={rankingAberto}
        onFechar={() => setRankingAberto(false)}
      />
    </div>
  );
}
