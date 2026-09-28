import styles from "./ScoreBoard.module.css";

export function ScoreBoard({ items }) {
  return (
    <div className={styles.container}>
      {items.map((item) => (
        <div key={item.label} className={styles.item}>
          <span className={styles.label}>{item.label}</span>

          <span className={styles.value}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}