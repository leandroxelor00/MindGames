import { gamesRegistry } from "../games/registry";
import { useParams, Link } from "react-router-dom";
import { Button } from "../components/Button/Button";
import styles from "./GamePage.module.css";

export function GamePage() {
  const { id } = useParams();

  const selectedGame = gamesRegistry.find((registry) => id === registry.id);

  if (!selectedGame) {
    return (
      <div className={styles.naoEncontrado}>
        <h1>Jogo não encontrado</h1>
        <p>O jogo "{id}" não existe ou foi removido.</p>
        <Link to="/">
          <Button textContent="Voltar para a Home" />
        </Link>
      </div>
    );
  }

  const GameComponent = selectedGame.component;

  return (
    <div className={styles.container}>
      <Link className={styles.voltarLink} to="/">
        <Button textContent="Voltar" />
      </Link>
      <GameComponent />
    </div>
  );
}