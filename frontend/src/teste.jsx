import { useState, useEffect } from "react";

export function Minigame() {
  const [tempo, setTempo] = useState(10);
  const [isTimerOn, setIsTimerOn] = useState(false);

  const [score, setScore] = useState(0);
  const [num, setNum] = useState(10);
  let currentNumber = num;

  function IsCurrentNumberGreaterThan() {
    if (num > currentNumber) {
      setScore((score) => score + 1);
    }
  }
  function IsCurrentNumberLessThan() {
    if (num < currentNumber) {
      setScore((score) => score + 1);
    }
  }

  useEffect(() => {
    if (tempo === 0) {
      setIsTimerOn(false);
    }
  }, [tempo]);

  useEffect(() => {
    if (!isTimerOn) {
      return;
    }

    const interval = setInterval(() => {
      setTempo((tempo) => tempo - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isTimerOn]);

  return (
    <div style={{ justifySelf: "center" }}>
      <p style={{ justifySelf: "center", fontSize: 24 }}>Tempo: {tempo}</p>
      <div>- - - - - - - - - - - - - - - - - - - - - - </div>
      <p style={{ justifySelf: "center", fontSize: 64 }}>{currentNumber}</p>
      <button
        style={{ fontSize: 32 }}
        onClick={() => {
          setIsTimerOn(true);
          IsCurrentNumberGreaterThan();
        }}
      >
        Maior
      </button>
      <button
        style={{ fontSize: 24 }}
        onClick={() => {
          setIsTimerOn(true);
          IsCurrentNumberLessThan();
        }}
      >
        Menor
      </button>
    </div>
  );
}
