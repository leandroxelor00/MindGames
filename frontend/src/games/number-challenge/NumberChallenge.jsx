import { useNumberChallenge } from "./useNumberChallenge";
import { Timer } from "../../components/Timer/Timer";
import { ScoreBoard } from "../../components/ScoreBoard/ScoreBoard";
import styles from "./NumberChallenge.module.css";

export function NumberChallenge() {
  const {
    desafio,
    score,
    escolher,
    segundos,
    gameOver,
    startTimer,
    avgReactionTime,
    resetGame,
    nivel,
  } = useNumberChallenge();

  function handleEscolher(lado) {
    startTimer();
    escolher(lado);
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Desafio Numérico</h1>

      <div className={styles.painel}>
        <Timer segundos={segundos} label="Tempo Restante" />

        <ScoreBoard
          items={[
            { label: "Pontuação", value: score },
            { label: "Nível", value: nivel },
          ]}
        />
      </div>

      {!gameOver && (
        <div className={styles.cartas}>
          <button
            type="button"
            className={styles.carta}
            onClick={() => handleEscolher("esquerda")}
            disabled={gameOver}
          >
            {desafio.esquerda.texto}
          </button>

          <button
            type="button"
            className={styles.carta}
            onClick={() => handleEscolher("direita")}
            disabled={gameOver}
          >
            {desafio.direita.texto}
          </button>
        </div>
      )}

      {gameOver && (
        <div className={styles.mensagemFim}>
          <h2>⏱️ Fim de jogo!</h2>

          <p>
            Pontuação final: <strong>{score}</strong>
          </p>

          <p>
            Tempo médio de reação:{" "}
            <strong>{avgReactionTime} ms</strong>
          </p>

          <button
            type="button"
            className={styles.botaoReiniciar}
            onClick={resetGame}
          >
            Jogar novamente
          </button>
        </div>
      )}
    </div>
  );
}