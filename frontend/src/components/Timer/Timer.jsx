import styles from "./Timer.module.css";

export function Timer({ segundos, label = "Tempo" }) {
  return (
    <p className={styles.container}>
      {label}: {segundos}s
    </p>
  );
}
