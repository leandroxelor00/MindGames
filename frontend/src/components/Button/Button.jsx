import styles from "./Button.module.css";

export function Button({ textContent, onClick }) {
  return (
    <button className={styles.btn} onClick={onClick}>
      {textContent}
    </button>
  );
}
