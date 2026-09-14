import styles from "./Button.module.css";

export function Button({ textContent, onClick }) {
  return (
    <div className={styles.btnContainer}>
      <button className={styles.btn} onClick={onClick}>
        {textContent}
      </button>
    </div>
  );
}
