import { Button } from "../Button/Button";
import styles from "./GameOverModal.module.css";

export function GameOverModal({ customStyle, message, onClick }) {
  return (
    <div className={styles.mensagemVitoria} style={customStyle}>
      {message}

      <Button textContent="Jogar novamente" onClick={onClick} />
    </div>
  );
}
