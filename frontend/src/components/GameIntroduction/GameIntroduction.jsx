import { Speakable } from "../Speakable/Speakable";
import styles from "./GameIntroduction.module.css";

export function GameIntroduction({ game, onStart }) {
  return (
    <div className={styles.card}>
      <Speakable as="div" text={`${game.name}. ${game.description}`}>
        {" "}
        <div className={styles.header}>
          {" "}
          <div className={styles.icon} aria-hidden="true">
            🎮{" "}
          </div>
          <div>
            <p className={styles.eyebrow}>Como jogar</p>

            <h1 id="game-introduction-title">{game.name}</h1>
          </div>
        </div>
      </Speakable>

      <Speakable as="div" text={`Descrição. ${game.description}`}>
        <p className={styles.description}>{game.description}</p>
      </Speakable>

      <Speakable as="div" text={`Regras do jogo. ${game.rules.join(". ")}`}>
        <div className={styles.rules}>
          <h2>Regras</h2>

          <ol>
            {game.rules.map((rule, index) => (
              <li key={index}>{rule}</li>
            ))}
          </ol>
        </div>
      </Speakable>

      <div className={styles.actions}>
        <Speakable as="span" text={`Começar ${game.name}`}>
          <button
            className={styles.startButton}
            onClick={onStart}
            type="button"
          >
            Começar
          </button>
        </Speakable>
      </div>
    </div>
  );
}
