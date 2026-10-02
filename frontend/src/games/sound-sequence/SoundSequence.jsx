import { useSoundSequence } from "./useSoundSequence";
import styles from "./SoundSequence.module.css";

export function SoundSequence() {
  const { sequencia, passoAtual, reproduzindo, gameOver, fase, iniciarJogo } =
    useSoundSequence();

  return (
    <main className={styles.container}>
      <h1>Sequência de Sons</h1>

      <p>
        Ouça a sequência de sons e repita usando as setas do teclado.
        <br />
        Seta para cima é o som mais agudo e seta para baixo é o mais grave.
      </p>

      <p>Você pode apertar as setas em qualquer lugar da página.</p>

      {fase > 0 && <p>Fase: {fase}</p>}

      <p aria-live="polite">
        {fase === 0
          ? "Pressione Começar, ou aperte as setas livremente para ouvir os sons."
          : reproduzindo
            ? "Ouça a sequência..."
            : "Sua vez! Repita a sequência."}
      </p>

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

          <button type="button" onClick={iniciarJogo}>
            Jogar novamente
          </button>
        </section>
      )}
    </main>
  );
}
