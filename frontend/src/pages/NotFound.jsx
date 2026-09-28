import { Link } from "react-router-dom";
import { Button } from "../components/Button/Button";
import styles from "../pages/GamePage.module.css";

export function NotFound() {
  return (
    <div className={styles.naoEncontrado}>
      <h1>Página não encontrada</h1>
      <p>O endereço que você tentou acessar não existe.</p>
      <Link to="/">
        <Button textContent="Voltar para a Home" />
      </Link>
    </div>
  );
}