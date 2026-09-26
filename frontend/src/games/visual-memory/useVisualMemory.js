import { use, useEffect, useState } from "react";
import { levels } from "./levels";

export function useVisualMemory() {
  const [level, setLevel] = useState(1);
  const [gridLength, setGridLength] = useState(9);
  const [cells, setCells] = useState(3);
  const [highlightedCells, setHighlightedCells] = useState(new Set());
  const [selectedCells, setSelectedCells] = useState(new Set());
  const [showTime, setShowTime] = useState(800);
  const [index, setIndex] = useState(0);
  const [isShowingPartern, setIsShowingPartern] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [gameStopped, setGameStopped] = useState(true);
  const [levelDone, setLevelDone] = useState(false);
  const [tries, setTries] = useState(cells);
  const min = 0;
  const max = gridLength - 1;

  useEffect(() => {
    if (!isShowingPartern) {
      setGameStopped(false);
    }
  }, [isShowingPartern]);

  function runGame() {
    generateHighlightedCells();
    const interval = setInterval(() => {
      setIndex((index) => {
        const next = index + 1;
        if (next >= cells) {
          clearInterval(interval);
          setIsShowingPartern(false);
        }
        return next;
      });
    }, showTime);
    return () => clearInterval(interval);
  }

  function currentLevel() {
    const level = levels.map((element, index) => {
      return setCells(element);
    });
  }

  useEffect(() => {
    runGame();
  }, []);

  function generateGrid() {
    return Array.from({ length: gridLength }, (_, i) => i);
  }
  function randomPos(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  function generateHighlightedCells() {
    if (gameOver) {
      return;
    }
    const newHighlightedCells = new Set();
    while (newHighlightedCells.size < cells) {
      newHighlightedCells.add(randomPos(min, max));
    }
    setHighlightedCells(newHighlightedCells);
  }
  function handleCellClick(cell) {
    if (gameStopped) {
      return;
    }
    const cellClicked = new Set(selectedCells);
    cellClicked.add(cell);
    setTries((tries) => tries - 1);
    setSelectedCells(cellClicked);
  }

  function checkCorrectCells(cell) {
    const selectedCellsArr = [...selectedCells];
    const isCorrect = selectedCellsArr.every((element) => {
      return highlightedCells.has(element);
    });
    isCorrect ? setLevelDone(true) : setGameOver(true);
  }

  useEffect(() => {
    if (selectedCells.size === cells) {
      console.log("tentativas acabaram");
      setGameStopped(true);
      checkCorrectCells();
    }
  }, [tries]);

  function resetGame() {
    setTimeout(() => {
      setGameOver(false);
      runGame();
      setIsShowingPartern(true);
      setSelectedCells(new Set());
      setGameStopped(true);
      setLevelDone(false);
      setIndex(0);
      setTries(cells);
    }, 400);
  }

  return {
    generateGrid,
    highlightedCells,
    isShowingPartern,
    handleCellClick,
    selectedCells,
    levelDone,
    gameOver,
    resetGame,
  };
}
