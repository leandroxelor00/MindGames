import { useEffect, useState } from "react";
import { UseStroopTest } from "./useStroopTest";
import "./StroopTest.module.css";

export function StroopTest() {
  const { timer, score, startTimer, currentWord, currentColor, changeWord, isColorBlue,isColorGreen,isColorRed,isColorYellow } = UseStroopTest();

  return (
    <div style={{display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center"}}>
      <p>Tempo: {timer}</p>
      <p>Pontuação: {score}</p>
      <p style={{color: currentColor}}>{currentWord} </p>
      
      <div id="btn-container" style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5}}>
      <button className="btncolor" onClick={()=> {isColorBlue();changeWord();startTimer()}}>AZUL</button>
      <button className="btncolor" onClick={()=> {isColorGreen();changeWord();startTimer()}}>VERDE</button>
      <button className="btncolor" onClick={()=> {isColorRed();changeWord();startTimer()}}>VERMELHO</button>
      <button className="btncolor" onClick={()=> {isColorYellow();changeWord();startTimer()}}>AMARELO</button>
      </div>
    </div>
  );
}
