import { use, useEffect, useState } from "react";

export function useVisualMemory() {
  const [gridLength, setGridLength] = useState(9);
  const [level, setLevel] = useState(1);
  const [cells, setCells] = useState(3);
  const [highlightedCells, setHighlightedCells] = useState(new Set());
  const [visibleCells, setVisibleCells] = useState(new Set());
  const [selectedCells, setSelectedCells] = useState(new Set());
  const [showTime, setShowTime] = useState(600);
  const [index, setIndex] = useState(0);
  const [isShowingPartern, setIsShowingPartern] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [gameStopped, setGameStopped] = useState(false);
  const [tries, setTries] = useState(cells);
  const min = 0;
  const max = gridLength - 1;

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const highlightedCellsArr = [...highlightedCells];
    const slicedArr = highlightedCellsArr.slice(0, index);
    setVisibleCells(slicedArr);
  }, [index]);

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
  console.log(highlightedCells);

  function checkCorrectCells(cell) {
    const selectedCellsArr = [...selectedCells];
    const isCorrect = selectedCellsArr.every((element) => {
      return highlightedCells.has(element);
    });
    isCorrect ? console.log("Acertou") : console.log("Errou");
  }

  useEffect(() => {
    if (selectedCells.size === cells) {
      console.log("tentativas acabaram");
      setGameStopped(true);
      checkCorrectCells();
    }
  }, [tries]);

  return { generateGrid, highlightedCells, isShowingPartern, handleCellClick };
}
