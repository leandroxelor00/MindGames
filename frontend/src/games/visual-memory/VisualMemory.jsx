import { GameOverModal } from "../../components/GameOverModal/GameOverModal";
import { useVisualMemory } from "./useVisualMemory";
import styles from "./VisualMemory.module.css";

export function VisualMemory() {
  const {
    generateGrid,
    highlightedCells,
    isShowingPartern,
    handleCellClick,
    selectedCells,
    levelDone,
    gameOver,
    resetGame,
  } = useVisualMemory();

  return (
    <div>
      <div className={styles.gridContainer}>
        {" "}
        {generateGrid().map((cell) =>
          (isShowingPartern && highlightedCells.has(cell)) ||
          selectedCells.has(cell) ? (
            <div
              key={cell}
              onClick={() => handleCellClick(cell)}
              className={styles.highlightedCell}
            ></div>
          ) : (
            <div
              key={cell}
              onClick={() => handleCellClick(cell)}
              className={styles.cell}
            ></div>
          ),
        )}{" "}
      </div>
      {levelDone && <GameOverModal message={"Você concluiu o nível!"} />}
      {gameOver && (
        <GameOverModal message={"Você errou!"} onClick={resetGame} />
      )}
    </div>
  );
}
