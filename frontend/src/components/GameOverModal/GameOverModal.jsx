import { Button } from "../Button/Button";
import styles from "./GameOverModal.module.css";

export function GameOverModal({
  textContent,
  customStyle,
  message,
  onClick,
  buttonText = "Jogar novamente",
}) {
  return (
    <div className={styles.overlay}>
      <div className={styles.mensagemVitoria} style={customStyle}>
        {message}
        <Button textContent={buttonText} onClick={onClick} />
      </div>
    </div>
  );
}
