import { gamesRegistry } from "../games/registry";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

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
    <div>
      <Link to="/">
        <button>Voltar</button>
      </Link>
      <GameComponent />
    </div>
  );
}
