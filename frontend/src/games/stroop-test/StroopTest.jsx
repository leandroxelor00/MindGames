import { useEffect, useState } from "react";
import { UseStroopTest } from "./useStroopTest";
import "./StroopTest.module.css";

export function StroopTest() {
  const { timer, score, startTimer, isColorCorrect } = UseStroopTest();

  return (
    <div>
      <p>Tempo: {timer}</p>
      <p>Pontuação: {score}</p>
      <p>cor: {isColorCorrect()} </p>
      <button onClick={startTimer}>Start timer</button>
    </div>
  );
}
