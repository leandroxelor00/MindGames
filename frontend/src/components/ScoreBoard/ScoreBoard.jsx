import styles from "./ScoreBoard.module.css";
export function ScoreBoard({ items }) {
  return (
    <div className={styles.container}>
      {" "}
      {items.map((item) => (
        <span key={item.label} className={styles.item}>
          <span className={styles.label}>{item.label}:</span> {item.value}{" "}
        </span>
      ))}{" "}
    </div>
  );
}
