import styles from "./Timer.module.css";

export function Timer({ segundos, label = "Tempo" }) {
  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{segundos}s</span>
      </div>
    </div>
  );
}