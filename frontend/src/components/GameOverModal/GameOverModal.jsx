import { Button } from "../Button/Button";
import { Link } from "react-router-dom";
import styles from "./GameOverModal.module.css";

export function GameOverModal({ message, link, onClick }) {
  return (
    <div className={styles.mensagemVitoria}>
      {message}

      <Link to={link}>
        <Button textContent="Voltar para o menu" />
      </Link>

      <Button textContent="Jogar novamente" onClick={onClick} />
    </div>
  );
}
