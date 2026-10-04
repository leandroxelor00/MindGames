import { useSoundSequence } from "./useSoundSequence";

import styles from "./SoundSequence.module.css";

export function SoundSequence() {
  const {
    reproduzindo,
    gameOver,
    fase,
    corAtiva,
    feedback,
    iniciarJogo,
    pressionarTecla,
    narradorAtivo,
    alternarNarrador,
  } = useSoundSequence();

  const classeFeedback =
    feedback === "acerto"
      ? styles.feedbackAcerto
      : feedback === "erro"
        ? styles.feedbackErro
        : "";

  return (
    <main className={styles.container}>
      <h1>Sequência de Sons</h1>

      <p>
        Ouça a sequência de sons e repita usando as setas do teclado.
        <br />
        Cada seta corresponde a uma cor e a um som diferente.
      </p>

      <p>↑ Verde · → Vermelho · ← Azul · ↓ Amarelo</p>

      <div
        className={`${styles.genius} ${classeFeedback}`}
        role="group"
        aria-label="Painel de sequência de sons"
      >
        <button
          type="button"
          className={`${styles.setor} ${styles.verde} ${
            corAtiva === "verde" ? styles.ativo : ""
          }`}
          aria-label="Verde, seta para cima"
          onClick={() => pressionarTecla("ArrowUp")}
          disabled={reproduzindo || gameOver}
        >
          <span aria-hidden="true">↑</span>
        </button>

        <button
          type="button"
          className={`${styles.setor} ${styles.vermelho} ${
            corAtiva === "vermelho" ? styles.ativo : ""
          }`}
          aria-label="Vermelho, seta para a direita"
          onClick={() => pressionarTecla("ArrowRight")}
          disabled={reproduzindo || gameOver}
        >
          <span aria-hidden="true">→</span>
        </button>

        <button
          type="button"
          className={`${styles.setor} ${styles.azul} ${
            corAtiva === "azul" ? styles.ativo : ""
          }`}
          aria-label="Azul, seta para a esquerda"
          onClick={() => pressionarTecla("ArrowLeft")}
          disabled={reproduzindo || gameOver}
        >
          <span aria-hidden="true">←</span>
        </button>

        <button
          type="button"
          className={`${styles.setor} ${styles.amarelo} ${
            corAtiva === "amarelo" ? styles.ativo : ""
          }`}
          aria-label="Amarelo, seta para baixo"
          onClick={() => pressionarTecla("ArrowDown")}
          disabled={reproduzindo || gameOver}
        >
          <span aria-hidden="true">↓</span>
        </button>

        <div className={styles.centro} aria-hidden="true">
          <span>🎵</span>
        </div>
      </div>

      {fase > 0 && <p className={styles.fase}>Fase: {fase}</p>}

      <p aria-live="polite">
        {fase === 0
          ? "Pressione Começar, ou aperte as setas ou as cores livremente para ouvir os sons."
          : reproduzindo
            ? "Ouça a sequência..."
            : feedback === "acerto"
              ? "Acerto!"
              : feedback === "erro"
                ? "Erro! Fim de jogo."
                : "Sua vez! Repita a sequência."}
      </p>

      <button
        type="button"
        className={styles.botao}
        onClick={alternarNarrador}
        aria-pressed={narradorAtivo}
        aria-label={narradorAtivo ? "Desativar narrador" : "Ativar narrador"}
      >
        {narradorAtivo ? "🔊 Narrador: ligado" : "🔇 Narrador: desligado"}
      </button>

      {!gameOver && (
        <button
          type="button"
          className={styles.botao}
          onClick={iniciarJogo}
          disabled={fase > 0}
        >
          Começar
        </button>
      )}

      {gameOver && (
        <section aria-live="polite">
          <h2>Fim de jogo!</h2>

          <p>Você alcançou a fase {fase - 1}.</p>

          <button type="button" className={styles.botao} onClick={iniciarJogo}>
            Jogar novamente
          </button>
        </section>
      )}
    </main>
  );
}
