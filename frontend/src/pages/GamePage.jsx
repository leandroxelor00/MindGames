import { gamesRegistry } from "../games/registry";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "../components/Button/Button";

export function GamePage() {
  const { id } = useParams();

  const selectedGame = gamesRegistry.find((registry) => {
    return id === registry.id;
  });

  if (!selectedGame) {
    return <h1>Jogo não encontrado</h1>;
  }

  const GameComponent = selectedGame.component;

  return (
    <div style={{ marginLeft: 50, marginTop: 20 }}>
      <Link style={{ display: "flex", width: 200 }} to="/">
        <Button textContent="Voltar" />
      </Link>
      <GameComponent />
    </div>
  );
}
