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
    mensagemAcessibilidade,
  } = useVisualMemory();

  function renderCell(cell) {
    let className = styles.cell;
    let label = `Célula ${cell + 1}`;

    if (gameStopped) {
      className = styles[getCellStatus(cell)];

      if (selectedCells.has(cell)) {
        label += " selecionada";
      }

      if (highlightedCells.has(cell)) {
        label += " correta";
      } else if (selectedCells.has(cell)) {
        label += " incorreta";
      }
    } else if (isShowingPartern && highlightedCells.has(cell)) {
      className = styles.highlightedCell;
      label += " destacada para memorizar";
    } else if (selectedCells.has(cell)) {
      className = styles.highlightedCell;
      label += " selecionada";
    } else {
      label += " vazia";
    }

    return (
      <button
        key={cell}
        type="button"
        className={className}
        onClick={() => handleCellClick(cell)}
        aria-label={label}
      />
    );
  }

  return (
    <div className={styles.container}>
      <p
        className={styles.leitorTela}
        aria-live="polite"
      >
        {mensagemAcessibilidade}
      </p>

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

      <p className={styles.p}>
        Nível: {levelIndex + 1}
      </p>

      <div
        className={styles.gridContainer}
        style={{
          gridTemplateColumns: `repeat(${gridTemplate()}, 1fr)`,
        }}
      >
        {generateGrid().map((cell) => renderCell(cell))}
      </div>
    </div>
  );
}