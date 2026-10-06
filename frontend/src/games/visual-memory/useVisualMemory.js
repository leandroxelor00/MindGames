import { useEffect, useState } from "react";
import { levels } from "./levels";
import { postScore } from "../../services/scoreService";
import { useNotification } from "../../context/NotificationContext";

export function useVisualMemory() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [gridLength, setGridLength] = useState(levels[levelIndex].gridLength);
  const [cells, setCells] = useState(levels[levelIndex].cells);
  const [highlightedCells, setHighlightedCells] = useState(new Set());
  const [selectedCells, setSelectedCells] = useState(new Set());
  const [isShowingPartern, setIsShowingPartern] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [gameStopped, setGameStopped] = useState(false);
  const [levelDone, setLevelDone] = useState(false);
  const [allLevelsDone, setAllLevelsDone] = useState(false);
  const [mensagemAcessibilidade, setMensagemAcessibilidade] = useState("");

  const { notificar } = useNotification();

  const min = 0;
  const max = levels[levelIndex].gridLength - 1;

  function runGame() {
    const currentCells = levels[levelIndex].cells;
    const showTime = levels[levelIndex].showTime;

    generateHighlightedCells(currentCells);

    setMensagemAcessibilidade(`Memorize o padrão do nível ${levelIndex + 1}`);

    const timeout = setTimeout(() => {
      setIsShowingPartern(false);

      setMensagemAcessibilidade(
        "Agora selecione as células que estavam destacadas."
      );
    }, showTime);

    return () => clearTimeout(timeout);
  }

  function nextLevel() {
    setLevelIndex((levelIndex) => levelIndex + 1);

    setMensagemAcessibilidade("Próximo nível iniciado.");
  }

  useEffect(() => {
    resetGame();

    setTimeout(() => {
      setCells(levels[levelIndex].cells);
      setGridLength(levels[levelIndex].gridLength);
    }, 400);

    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  function checkCorrectCells(cellsToCheck) {
    const selectedCellsArr = [...cellsToCheck];

    const isCorrect = selectedCellsArr.every((element) => {
      return highlightedCells.has(element);
    });

    if (levelIndex === 14) {
      if (isCorrect) {
        setAllLevelsDone(true);
      } else {
        setGameOver(true);
      }
    } else {
      if (isCorrect) {
        setLevelDone(true);

        setMensagemAcessibilidade(
          `Parabéns! Você completou o nível ${levelIndex + 1}`
        );
      } else {
        setGameOver(true);

        setMensagemAcessibilidade("Resposta incorreta. Você perdeu.");
      }
    }
  }

  function handleCellClick(cell) {
    if (isShowingPartern) {
      return;
    }

    if (selectedCells.has(cell)) {
      return;
    }

    const cellClicked = new Set(selectedCells);

    cellClicked.add(cell);

    setSelectedCells(cellClicked);

    setMensagemAcessibilidade(`Célula ${cell + 1} selecionada`);

    if (cellClicked.size === cells) {
      setGameStopped(true);
      checkCorrectCells(cellClicked);
    }
  }

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
    setTimeout(() => {
      setGameOver(false);
      runGame();
      setGameStopped(false);
      setIsShowingPartern(true);
      setSelectedCells(new Set());
      setLevelDone(false);
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
      const levelReached = allLevelsDone ? levels.length : levelIndex;
      const result = buildScorePayload("visual-memory", { levelReached });

      try {
        await postScore(result);
      } catch (error) {
        console.error("Não foi possível enviar o resultado:", error);
        notificar(
          "Não foi possível salvar sua pontuação. Verifique sua conexão."
        );
      }
    }

    enviar();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver, allLevelsDone, notificar]);

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
    mensagemAcessibilidade,
  };
}
