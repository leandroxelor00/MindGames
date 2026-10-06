import { Button } from "../Button/Button";
import styles from "./GameIntroduction.module.css";

export function GameIntroduction({ game, onStart }) {
  return (
    <section className={styles.card} aria-labelledby="game-introduction-title">
      <div className={styles.icon} aria-hidden="true">
        🎮
      </div>

      <p className={styles.eyebrow}>Como jogar</p>
      <h1 id="game-introduction-title">{game.name}</h1>
      <p className={styles.description}>{game.description}</p>

      <div className={styles.rules}>
        <h2>Regras</h2>
        <ol>
          {game.rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ol>
      </div>

      <Button textContent="Começar" onClick={onStart} />
    </section>
  );
}
