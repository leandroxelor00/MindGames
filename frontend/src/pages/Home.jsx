import { gamesRegistry } from "../games/registry";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";

export function Home() {
  return (
    <div className={styles.cardsContainer}>
      {gamesRegistry.map((registry) => (
        <Link
          className={styles.link}
          key={registry.id}
          to={`/game/${registry.id}`}
        >
          <div className={styles.card}>{registry.name}</div>
        </Link>
      ))}
    </div>
  );
}
