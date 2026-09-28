import { useEffect, useState } from "react";
import { levels } from "./levels";
import { getCurrentUserId } from "../../services/userId";
import { postScore } from "../../services/scoreService";

export function useVisualMemory() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [gridLength, setGridLength] = useState(levels[levelIndex].gridLength);
  const [cells, setCells] = useState(levels[levelIndex].cells);
  const [showTime, setShowTime] = useState(levels[levelIndex].showTime);
  const [highlightedCells, setHighlightedCells] = useState(new Set());
  const [selectedCells, setSelectedCells] = useState(new Set());
  const [isShowingPartern, setIsShowingPartern] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [gameStopped, setGameStopped] = useState(false);
  const [levelDone, setLevelDone] = useState(false);
  const [tries, setTries] = useState(cells);
  const [allLevelsDone, setAllLevelsDone] = useState(false);
  const min = 0;
  const max = levels[levelIndex].gridLength - 1;

  useEffect(() => {
    if (!isShowingPartern) {
      setGameStopped(false);
    }
  }, [isShowingPartern]);

  function runGame() {
    const currentCells = levels[levelIndex].cells;
    const showTime = levels[levelIndex].showTime;
    generateHighlightedCells(currentCells);
    const timeout = setTimeout(() => {
      setIsShowingPartern(false);
    }, showTime);
    return () => clearTimeout(timeout);
  }

  function nextLevel() {
    setLevelIndex((levelIndex) => levelIndex + 1);
  }

  useEffect(() => {
    resetGame();
    setTimeout(() => {
      setCells(levels[levelIndex].cells);
      setGridLength(levels[levelIndex].gridLength);
      setShowTime(levels[levelIndex].showTime);
    }, 400);
  }, [levelIndex]);

  function gridTemplate() {
    return Math.sqrt(gridLength);
  }

  function generateGrid() {
    return Array.from({ length: gridLength }, (_, i) => i);
  }
  function randomPos(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  function generateHighlightedCells(currentCells) {
    const newHighlightedCells = new Set();
    while (newHighlightedCells.size < currentCells) {
      newHighlightedCells.add(randomPos(min, max));
    }
    setHighlightedCells(newHighlightedCells);
  }
  function handleCellClick(cell) {
    if (isShowingPartern) {
      return;
    }
    const cellClicked = new Set(selectedCells);
    cellClicked.add(cell);
    if (!selectedCells.has(cell)) {
      setTries((tries) => tries - 1);
      setSelectedCells(cellClicked);
    }
  }

  function checkCorrectCells(cell) {
    const selectedCellsArr = [...selectedCells];
    const isCorrect = selectedCellsArr.every((element) => {
      return highlightedCells.has(element);
    });
    if (levelIndex === 14) {
      isCorrect ? setAllLevelsDone(true) : setGameOver(true);
    } else {
      isCorrect ? setLevelDone(true) : setGameOver(true);
    }
  }

  useEffect(() => {
    if (selectedCells.size === cells) {
      console.log("tentativas acabaram");
      setGameStopped(true);
      checkCorrectCells();
    }
  }, [tries]);

  function getCellStatus(cell) {
    if (highlightedCells.has(cell)) {
      return "correctCell";
    } else if (selectedCells.has(cell)) {
      return "wrongCell";
    } else {
      return "neutralCell";
    }
  }

  function resetGame() {
    const currentCells = levels[levelIndex].cells;
    setTimeout(() => {
      setGameOver(false);
      runGame();
      setGameStopped(false);
      setIsShowingPartern(true);
      setSelectedCells(new Set());
      setLevelDone(false);
      setTries(currentCells);
    }, 400);
  }

  function newGame() {
    setLevelIndex(0);
  }

  useEffect(() => {
    if (!gameOver && !allLevelsDone) {
      return;
    }

    async function enviar() {
      const result = {
        userId: getCurrentUserId(),
        gameId: "visual-memory",
        score: levelIndex + 1,
        accuracy: 0,
        avgReactionTime: 0,
        levelReached: levelIndex + 1,
      };

      try {
        await postScore(result);
      } catch (error) {
        console.error("Não foi possível enviar o resultado:", error);
      }
    }

    enviar();
  }, [gameOver, allLevelsDone]);

  return {
    generateGrid,
    highlightedCells,
    isShowingPartern,
    handleCellClick,
    selectedCells,
    levelIndex,
    levelDone,
    gameOver,
    resetGame,
    nextLevel,
    gridTemplate,
    gameStopped,
    getCellStatus,
    newGame,
    allLevelsDone,
  };
}
