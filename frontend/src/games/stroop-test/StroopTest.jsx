import { useStroopTest } from "./useStroopTest";
import styles from "./StroopTest.module.css";
import { Timer } from "../../components/Timer/Timer";

export function StroopTest() {
  const {
    segundos,
    score,
    startTimer,
    currentWord,
    currentColor,
    changeWord,
    colorCorrect,
    avgReactionTime,
    gameOver,
    resetGame,
  } = useStroopTest();

  // Função auxiliar para processar a jogada em cada botão
  const handleAnswer = (colorName) => {
    if (gameOver) return;
    colorCorrect(colorName);
    changeWord();
    startTimer();
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Stroop Test</h1>

      {/* Mensagem de Fim de Jogo bonita baseada no seu exemplo */}
      {gameOver && (
        <div className={styles.mensagemVitoria}>
          Fim de jogo! Você fez {score} pontos com uma média de{" "}
          {avgReactionTime}ms de reação.
        </div>
      )}

      <div className={styles.painel}>
        <Timer segundos={segundos} label="Tempo Restante" />
        <p>Pontuação: {score}</p>
        <p className={styles.reactionTime}>
          Tempo de reação (média): {avgReactionTime}ms
        </p>
      </div>

      <div className={styles.wordDisplay}>
        <p style={{ color: currentColor }}>{currentWord}</p>
      </div>

      <div className={styles.gradeBotoes}>
        <button
          disabled={gameOver}
          className={styles.btnColor}
          onClick={() => handleAnswer("AZUL")}
        >
          AZUL
        </button>
        <button
          disabled={gameOver}
          className={styles.btnColor}
          onClick={() => handleAnswer("VERDE")}
        >
          VERDE
        </button>
        <button
          disabled={gameOver}
          className={styles.btnColor}
          onClick={() => handleAnswer("VERMELHO")}
        >
          VERMELHO
        </button>
        <button
          disabled={gameOver}
          className={styles.btnColor}
          onClick={() => handleAnswer("AMARELO")}
        >
          AMARELO
        </button>
      </div>
    </div>
  );
}
