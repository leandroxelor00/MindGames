import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { gamesRegistry } from "../../games/registry";
import { useAuth } from "../../hooks/useAuth";
import { getGameRanking, getGlobalRanking } from "../../services/rankingService";
import { RankingList } from "../RankingList/RankingList";

import styles from "./RankingModal.module.css";

export function RankingModal({ aberto, onFechar }) {
  const { user } = useAuth();

  const [tab, setTab] = useState("global");
  const [gameId, setGameId] = useState(gamesRegistry[0].id);
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({ key: null, data: null, error: null });

  const closeButtonRef = useRef(null);

  // Identifica o pedido atual; muda sempre que aba, jogo ou tentativa mudam.
  const requestKey = aberto
    ? `${tab === "global" ? "global" : `jogo:${gameId}`}#${attempt}`
    : null;

  useEffect(() => {
    if (!requestKey) return;

    let cancelled = false;
    const request =
      tab === "global" ? getGlobalRanking(10) : getGameRanking(gameId, 10);

    request
      .then((data) => {
        if (!cancelled) setState({ key: requestKey, data, error: null });
      })
      .catch((err) => {
        if (!cancelled)
          setState({ key: requestKey, data: null, error: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, [requestKey, tab, gameId]);

  // Fecha com Esc e coloca o foco no botão de fechar ao abrir.
  useEffect(() => {
    if (!aberto) return;

    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") onFechar();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [aberto, onFechar]);

  if (!aberto) return null;

  const loading = state.key !== requestKey;
  const data = loading ? null : state.data;
  const error = loading ? null : state.error;

  const usernameAtual = user?.username ?? null;
  const minhaPosicaoForaDoTop =
    data?.minhaPosicao &&
    !data.ranking.some((item) => item.username === data.minhaPosicao.username);

  return (
    <div
      className={styles.overlay}
      onClick={(event) => {
        if (event.target === event.currentTarget) onFechar();
      }}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ranking-title"
      >
        <header className={styles.header}>
          <h2 id="ranking-title" className={styles.title}>
            Ranking
          </h2>

          <button
            ref={closeButtonRef}
            type="button"
            className={styles.closeButton}
            onClick={onFechar}
            aria-label="Fechar ranking"
          >
            ✕
          </button>
        </header>

        <div className={styles.tabs} role="tablist" aria-label="Tipo de ranking">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "global"}
            className={`${styles.tab} ${tab === "global" ? styles.tabActive : ""}`}
            onClick={() => setTab("global")}
          >
            Global
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={tab === "jogo"}
            className={`${styles.tab} ${tab === "jogo" ? styles.tabActive : ""}`}
            onClick={() => setTab("jogo")}
          >
            Por jogo
          </button>
        </div>

        {tab === "jogo" && (
          <div className={styles.gamePicker}>
            <label htmlFor="ranking-game" className={styles.gameLabel}>
              Jogo
            </label>

            <select
              id="ranking-game"
              className={styles.select}
              value={gameId}
              onChange={(event) => setGameId(event.target.value)}
            >
              {gamesRegistry.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <p className={styles.rule}>
          {tab === "global"
            ? "Soma do seu melhor resultado em cada jogo."
            : "Média das suas 3 melhores partidas neste jogo (mínimo de 3 partidas)."}
        </p>

        <div className={styles.content} aria-live="polite">
          {loading && <p className={styles.message}>Carregando ranking...</p>}

          {error && (
            <div className={styles.errorBox} role="alert">
              <p>Não foi possível carregar o ranking.</p>
              <button
                type="button"
                className={styles.retryButton}
                onClick={() => setAttempt((n) => n + 1)}
              >
                Tentar de novo
              </button>
            </div>
          )}

          {data && (
            <>
              <RankingList
                items={data.ranking}
                usernameAtual={usernameAtual}
              />

              {minhaPosicaoForaDoTop && (
                <div className={styles.mine}>
                  <span className={styles.mineLabel}>Sua posição</span>
                  <RankingList
                    items={[data.minhaPosicao]}
                    usernameAtual={usernameAtual}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {!user && (
          <p className={styles.notice}>
            Quer aparecer no ranking?{" "}
            <Link to="/register" className={styles.noticeLink}>
              Crie uma conta
            </Link>
            .
          </p>
        )}

        {user && !user.username && (
          <p className={styles.notice}>
            Sua conta não tem um username, por isso você não aparece no
            ranking. Crie uma conta nova para participar.
          </p>
        )}
      </div>
    </div>
  );
}
