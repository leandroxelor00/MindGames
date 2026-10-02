import { Button } from "../Button/Button";
import styles from "./GameOverModal.module.css";

export function GameOverModal({
  customStyle,
  message,
  onClick,
  buttonText = "Jogar novamente",
}) {
  return (
    <div className={styles.overlay}>
      <div className={styles.mensagemVitoria} style={customStyle} role="status" aria-live="polite">
        {message}
        <Button textContent={buttonText} onClick={onClick} />
      </div>
    </div>
  );
}
