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
  feedback,
  mensagemAcessibilidade,
} = useNumberChallenge();

  function handleEscolher(lado) {
    startTimer();
    escolher(lado);
  }

  function getClasseCarta(lado) {
    if (!feedback || feedback.lado !== lado) {
      return styles.carta;
    }

    if (feedback.resultado === "acerto") {
      return `${styles.carta} ${styles.acerto}`;
    }

    return `${styles.carta} ${styles.erro}`;
  }

  function getAriaFeedback(lado) {
    if (!feedback || feedback.lado !== lado) {
      return `Escolha ${lado}: ${desafio[lado].texto}`;
    }

    if (feedback.resultado === "acerto") {
      return `Resposta correta: ${desafio[lado].texto}`;
    }

    return `Resposta incorreta: ${desafio[lado].texto}`;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>
        Desafio Numérico
      </h1>

      <div
        className={styles.leitorTela}
        aria-live="polite"
      >
        {mensagemAcessibilidade}
      </div>

      <div className={styles.painel}>
        <Timer
          segundos={segundos}
          label="Tempo Restante"
        />

        <ScoreBoard
          items={[
            {
              label: "Pontuação",
              value: score,
            },
            {
              label: "Nível",
              value: nivel,
            },
          ]}
        />
      </div>

      {!gameOver && (
        <>
          <div
            className={styles.indicadorNivel}
            aria-label={`Nível atual ${nivel}`}
          >
            <span className={styles.labelNivel}>
              Nível {nivel}
            </span>

            <div className={styles.niveis}>
              {[1, 2, 3].map((numero) => (
                <span
                  key={numero}
                  aria-hidden="true"
                  className={`${styles.pontoNivel} ${
                    numero <= nivel
                      ? styles.pontoNivelAtivo
                      : ""
                  }`}
                />
              ))}
            </div>
          </div>

          <div className={styles.cartas}>
            <button
              type="button"
              className={getClasseCarta("esquerda")}
              onClick={() => handleEscolher("esquerda")}
              disabled={feedback !== null}
              aria-label={getAriaFeedback("esquerda")}
            >
              {desafio.esquerda.texto}
            </button>

            <button
              type="button"
              className={getClasseCarta("direita")}
              onClick={() => handleEscolher("direita")}
              disabled={feedback !== null}
              aria-label={getAriaFeedback("direita")}
            >
              {desafio.direita.texto}
            </button>
          </div>
        </>
      )}

      {gameOver && (
        <div
          className={styles.mensagemFim}
          role="alert"
        >
          <h2>
            ⏱️ Fim de jogo!
          </h2>

          <p>
            Pontuação final:
            {" "}
            <strong>{score}</strong>
          </p>

          <p>
            Tempo médio de reação:
            {" "}
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