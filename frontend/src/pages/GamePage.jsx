import { useState } from "react";
import { gamesRegistry } from "../games/registry";
import { gameComponents } from "../games/gameComponents";
import { useParams, Link } from "react-router-dom";
import { Button } from "../components/Button/Button";
import { GameIntroduction } from "../components/GameIntroduction/GameIntroduction";
import styles from "./GamePage.module.css";

export function GamePage() {
  const { id } = useParams();
  const [jogoIniciado, setJogoIniciado] = useState(false);
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

  const GameComponent = gameComponents[id];

  return (
    <div className={styles.container}>
      <Link className={styles.voltarLink} to="/">
        <Button textContent="Voltar" />
      </Link>

      {!jogoIniciado ? (
        <GameIntroduction
          game={selectedGame}
          onStart={() => setJogoIniciado(true)}
        />
      ) : (
        <GameComponent />
      )}
    </div>
  );
}
