import { gamesRegistry } from "../games/registry";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";

export function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <h1 className={styles.headline}>Treine sua mente com ciência.</h1>
        <p className={styles.subtitle}>
          Jogos curtos que medem atenção, memória e tempo de reação — acompanhe
          sua evolução partida após partida.
        </p>
        <Link to="/dashboard" className={styles.dashboardLink}>
          Ver meu histórico
        </Link>
      </header>

      <section>
        <h2 className={styles.sectionLabel}>Escolha um jogo</h2>
        <div className={styles.cardsContainer}>
          {gamesRegistry.map((registry) => (
            <Link
              className={styles.link}
              key={registry.id}
              to={`/game/${registry.id}`}
            >
              <div className={styles.card}>
                <span className={styles.cardName}>{registry.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
