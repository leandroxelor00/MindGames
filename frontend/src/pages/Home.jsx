import { useEffect, useRef, useState } from "react";
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
  const [acessibilidadeAberta, setAcessibilidadeAberta] = useState(false);

  const accessibilityPanelRef = useRef(null);

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

  useEffect(() => {
    if (!acessibilidadeAberta) {
      window.speechSynthesis?.cancel();
      return;
    }

    accessibilityPanelRef.current?.focus();

    if (!("speechSynthesis" in window)) {
      return;
    }

    const textoAcessibilidade =
      "Use um leitor de tela. " +
      "O MindGames é compatível com leitores de tela. " +
      "No Windows, você pode usar o Narrador para ouvir os textos, botões, links e informações da página. " +
      "Para ativar ou desativar o Narrador do Windows, pressione Windows, Ctrl e Enter.";

    const utterance = new SpeechSynthesisUtterance(
      textoAcessibilidade,
    );

    utterance.lang = "pt-BR";
    utterance.rate = 1;
    utterance.pitch = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [acessibilidadeAberta]);

  function handleLogout() {
    logout();
    setUser(null);
  }

  function abrirAcessibilidade() {
    setAcessibilidadeAberta((aberta) => !aberta);
  }

  function fecharAcessibilidade() {
    setAcessibilidadeAberta(false);
  }

  return (
    <div className={styles.page}>
      <nav className={styles.navbar}>
        <span className={styles.brand}>MindGames</span>

        <div className={styles.navActions}>
          <Link to="/dashboard" className={styles.navLink}>
            Ver meu histórico
          </Link>

          <button
            type="button"
            className={styles.accessibilityButton}
            onClick={abrirAcessibilidade}
            aria-expanded={acessibilidadeAberta}
            aria-controls="painel-acessibilidade"
            aria-label="Abrir opções de acessibilidade"
            title="Opções de acessibilidade"
          >
            <span aria-hidden="true">♿</span>
            <span>Acessibilidade</span>
          </button>

          {user ? (
            <div className={styles.navUser}>
              <span className={styles.navEmail}>
                Olá, <strong>{user.username ?? user.email}</strong>
              </span>

              <button
                type="button"
                className={styles.navButtonGhost}
                onClick={handleLogout}
              >
                Sair
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className={styles.navLink}>
                Entrar
              </Link>

              <Link
                to="/register"
                className={styles.navButtonPrimary}
              >
                Criar conta
              </Link>
            </>
          )}

          <Link to="/settings" className={styles.navLink}>
            Configurações
          </Link>
        </div>
      </nav>

      {acessibilidadeAberta && (
        <section
          id="painel-acessibilidade"
          className={styles.accessibilityPanel}
          aria-labelledby="titulo-acessibilidade"
          tabIndex="-1"
          ref={accessibilityPanelRef}
        >
          <div className={styles.accessibilityPanelHeader}>
            <div>
              <span className={styles.accessibilityPanelEyebrow}>
                ACESSIBILIDADE
              </span>

              <h2
                id="titulo-acessibilidade"
                className={styles.accessibilityPanelTitle}
              >
                Use um leitor de tela
              </h2>
            </div>

            <button
              type="button"
              className={styles.accessibilityClose}
              onClick={fecharAcessibilidade}
              aria-label="Fechar opções de acessibilidade"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <p className={styles.accessibilityPanelText}>
            O MindGames é compatível com leitores de tela. No
            Windows, você pode usar o Narrador para ouvir os textos,
            botões, links e informações da página.
          </p>

          <div className={styles.accessibilityShortcut}>
            <span className={styles.shortcutLabel}>
              Ativar ou desativar o Narrador do Windows
            </span>

            <kbd>Windows</kbd>

            <span aria-hidden="true">+</span>

            <kbd>Ctrl</kbd>

            <span aria-hidden="true">+</span>

            <kbd>Enter</kbd>
          </div>

          <div className={styles.accessibilityPanelActions}>
            <Link
              to="/settings"
              className={styles.accessibilitySettingsLink}
              onClick={fecharAcessibilidade}
            >
              Configurações de acessibilidade
            </Link>

            <button
              type="button"
              className={styles.accessibilityCloseButton}
              onClick={fecharAcessibilidade}
            >
              Fechar
            </button>
          </div>
        </section>
      )}

      <header className={styles.hero}>
        <h1 className={styles.headline}>
          Treine sua mente com ciência.
        </h1>

        <p className={styles.subtitle}>
          Jogos curtos que medem atenção, memória e tempo de reação —
          acompanhe sua evolução partida após partida.
        </p>
      </header>

      <div className={styles.homeContent}>
        <main>
          {/* Escolha um jogo */}
          <section>
            <h2 className={styles.sectionLabel}>
              Escolha um jogo
            </h2>

            <div className={styles.cardsContainer}>
              {gamesRegistry.map((registry) => (
                <Link
                  className={styles.link}
                  key={registry.id}
                  to={`/game/${registry.id}`}
                >
                  <div className={styles.card}>
                    <span className={styles.cardName}>
                      {registry.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </main>

        {/* Streak e daily challenge */}
        <aside className={styles.dailyAside}>
          <div className={styles.streakCard}>
            <span className={styles.streakIcon} aria-hidden="true">
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

          <section className={styles.challengeCard}>
            <span className={styles.challengeEyebrow}>
              DESAFIO DO DIA
            </span>

            <h2 className={styles.challengeTitle}>
              Sua seleção de hoje
            </h2>

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

                    <span
                      className={styles.challengeArrow}
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className={styles.rankingCard}>
            <span className={styles.challengeEyebrow}>
              RANKING
            </span>

            <h2 className={styles.challengeTitle}>
              Top jogadores
            </h2>

            {rankingError && (
              <p className={styles.rankingMessage}>
                Não foi possível carregar o ranking.
              </p>
            )}

            {!rankingError && topRanking === null && (
              <p className={styles.rankingMessage}>
                Carregando...
              </p>
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