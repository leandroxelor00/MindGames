import { useEffect, useState } from "react";
import { UseStroopTest } from "./useStroopTest";
import styles from "./StroopTest.module.css";

export function StroopTest() {
  const {
    timer,
    score,
    startTimer,
    currentWord,
    currentColor,
    changeWord,
    colorCorrect,
    avgReactionTime,
  } = UseStroopTest();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <p>Stroop Test</p>
      <div className={styles.infoContainer}>
        <p>Tempo: {timer}</p>
        <p>Pontuação: {score}</p>
        <p className={styles.reactionTime}>
          Tempo de reação (média): {avgReactionTime}ms
        </p>
      </div>
      <p style={{ color: currentColor }}>{currentWord} </p>

      <div
        id="btn-container"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}
      >
        <button
          className="btncolor"
          onClick={() => {
            colorCorrect("AZUL");
            changeWord();
            startTimer();
          }}
        >
          AZUL
        </button>
        <button
          className="btncolor"
          onClick={() => {
            colorCorrect("VERDE");
            changeWord();
            startTimer();
          }}
        >
          VERDE
        </button>
        <button
          className="btncolor"
          onClick={() => {
            colorCorrect("VERMELHO");
            changeWord();
            startTimer();
          }}
        >
          VERMELHO
        </button>
        <button
          className="btncolor"
          onClick={() => {
            colorCorrect("AMARELO");
            changeWord();
            startTimer();
          }}
        >
          AMARELO
        </button>
      </div>
    </div>
  );
}
