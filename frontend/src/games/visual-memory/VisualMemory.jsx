import { GameOverModal } from "../../components/GameOverModal/GameOverModal";
import { useVisualMemory } from "./useVisualMemory";
import styles from "./VisualMemory.module.css";

export function VisualMemory() {
  const {
    generateGrid,
    highlightedCells,
    isShowingPartern,
    handleCellClick,
    levelIndex,
    selectedCells,
    levelDone,
    gameOver,
    resetGame,
    nextLevel,
    gridTemplate,
    gameStopped,
    getCellStatus,
    newGame,
    allLevelsDone,
  } = useVisualMemory();

  return (
    <div className={styles.container}>
      {allLevelsDone && levelIndex === 14 && (
        <GameOverModal
          message={
            "Você venceu todos os níveis, parabéns!! Em breve terá o modo infinito, fique no aguardo!!"
          }
          onClick={resetGame}
          customStyle={{
            position: "fixed",
            top: "50%",
            left: "51%",
            transform: "translate(-50%, -50%)",
            zIndex: 100,
          }}
        />
      )}
      {levelDone && (
        <GameOverModal
          message={"Você concluiu o nível!"}
          onClick={nextLevel}
          buttonText="Próximo nível"
          customStyle={{
            position: "fixed",
            top: "50%",
            left: "51%",
            transform: "translate(-50%, -50%)",
            zIndex: 100,
          }}
        />
      )}
      {gameOver && (
        <GameOverModal
          message={"Você perdeu!"}
          onClick={newGame}
          buttonText="Tentar novamente"
          customStyle={{
            position: "fixed",
            top: "50%",
            left: "51%",
            transform: "translate(-50%, -50%)",
            zIndex: 100,
          }}
        />
      )}
      <p className={styles.p}> Nível: {levelIndex + 1}</p>
      <div
        className={styles.gridContainer}
        style={{ gridTemplateColumns: `repeat(${gridTemplate()}, 1fr)` }}
      >
        {generateGrid().map((cell) =>
          gameStopped ? (
            <div
              key={cell}
              onClick={() => handleCellClick(cell)}
              className={styles[getCellStatus(cell)]}
            ></div>
          ) : (isShowingPartern && highlightedCells.has(cell)) ||
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
        )}
      </div>
    </div>
  );
}
