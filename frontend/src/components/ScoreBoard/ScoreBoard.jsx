import styles from "./ScoreBoard.module.css";

export function ScoreBoard({ items }) {
  return (
    <div className={styles.container}>
      {items.map((item) => (
        <span key={item.label} className={styles.item}>
          {item.label}: {item.value}
        </span>
      ))}
    </div>
  );
}
