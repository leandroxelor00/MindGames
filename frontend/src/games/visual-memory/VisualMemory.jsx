import { useVisualMemory } from "./useVisualMemory";
import styles from "./VisualMemory.module.css";

export function VisualMemory() {
  const { generateGrid, highlightedCells } = useVisualMemory();
  console.log(highlightedCells);

  return (
    <div className={styles.gridContainer}>
      {generateGrid().map((cell) =>
        highlightedCells.has(cell) ? (
          <div key={cell} className={styles.highlightedCell}></div>
        ) : (
          <div key={cell} className={styles.cell}></div>
        )
      )}
    </div>
  );
}
