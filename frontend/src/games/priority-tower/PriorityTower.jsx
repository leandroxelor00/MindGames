import { GameOverModal } from "../../components/GameOverModal/GameOverModal";
import { ScoreBoard } from "../../components/ScoreBoard/ScoreBoard";
import { Timer } from "../../components/Timer/Timer";
import { usePriorityTower } from "./usePriorityTower";
import styles from "./PriorityTower.module.css";

export function PriorityTower() {
  const {
    puzzle,
    selectedItems,
    score,
    attempts,
    timer,
    gameOver,
    level,
    feedback,
    message,
    toggleItem,
    removeLastItem,
    submitOrder,
    resetGame,
  } = usePriorityTower();

  const selectedIds = new Set(selectedItems.map((item) => item.id));

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Lógica</p>
          <h1 className={styles.title}>Torre de Prioridade</h1>
          <p className={styles.subtitle}>
            Use as pistas para descobrir quem ocupa cada posição.
          </p>
        </div>

        <div className={styles.status}>
          <Timer segundos={timer} label="Tempo restante" />
          <ScoreBoard
            items={[
              { label: "Acertos", value: score },
              { label: "Nível", value: level },
            ]}
          />
        </div>
      </header>

      <div className={styles.liveRegion} aria-live="polite">
        {message}
      </div>

      {!gameOver && (
        <>
          <section className={styles.card} aria-labelledby="clues-title">
            <div className={styles.cardHeader}>
              <div>
                <p className={styles.cardEyebrow}>Pistas</p>
                <h2 id="clues-title">Descubra a ordem</h2>
              </div>
              <span className={styles.progress}>
                {selectedItems.length}/{puzzle.items.length} posições
              </span>
            </div>

            <ol className={styles.clues}>
              {puzzle.clues.map((clue, index) => (
                <li key={`${clue.type}-${index}`}>{clue.text}</li>
              ))}
            </ol>
          </section>

          <section className={styles.gameGrid}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <p className={styles.cardEyebrow}>Itens</p>
                  <h2>Escolha do primeiro ao último</h2>
                </div>
              </div>

              <div className={styles.itemGrid}>
                {puzzle.items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`${styles.itemCard} ${
                      selectedIds.has(item.id) ? styles.itemCardSelected : ""
                    }`}
                    onClick={() => toggleItem(item)}
                    aria-pressed={selectedIds.has(item.id)}
                    disabled={Boolean(feedback)}
                  >
                    <span className={styles.itemIcon} aria-hidden="true">
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <p className={styles.cardEyebrow}>Sua torre</p>
                  <h2>Ordem escolhida</h2>
                </div>
                <span className={styles.attempts}>Tentativas: {attempts}</span>
              </div>

              <div className={styles.tower} aria-label="Torre de prioridade">
                {puzzle.items.map((_, index) => {
                  const item = selectedItems[index];

                  return (
                    <div key={index} className={styles.towerRow}>
                      <span className={styles.position}>{index + 1}º</span>
                      <div className={styles.towerSlot}>
                        {item ? (
                          <>
                            <span className={styles.towerIcon} aria-hidden="true">
                              {item.icon}
                            </span>
                            <span>{item.name}</span>
                          </>
                        ) : (
                          <span className={styles.placeholder}>
                            Escolha um item
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={removeLastItem}
                  disabled={selectedItems.length === 0 || Boolean(feedback)}
                >
                  Desfazer último
                </button>
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={submitOrder}
                  disabled={
                    selectedItems.length !== puzzle.items.length ||
                    Boolean(feedback)
                  }
                >
                  Confirmar ordem
                </button>
              </div>

              {feedback && (
                <div
                  className={`${styles.feedback} ${
                    feedback.type === "success"
                      ? styles.feedbackSuccess
                      : styles.feedbackError
                  }`}
                  role="status"
                >
                  {feedback.text}
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {gameOver && (
        <GameOverModal
          message={
            <>
              <h2>🗼 Torre concluída!</h2>
              <p>
                Você resolveu <strong>{score}</strong> desafio(s) em {attempts}{" "}
                tentativa(s).
              </p>
              <p>Maior nível alcançado: <strong>{level}</strong>.</p>
            </>
          }
          onClick={resetGame}
        />
      )}
    </div>
  );
}
