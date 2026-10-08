import { themeOptions, useTheme } from "../../context/ThemeContext";
import { Speakable } from "../Speakable/Speakable";

import styles from "./ThemeSwitcher.module.css";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className={styles.row}>
      <Speakable as="span" text="Seu MindGames, seu estilo. Escolha o tema.">
        <span className={styles.caption}>
          <span aria-hidden="true">🎨</span>
          Seu MindGames, seu estilo
        </span>
      </Speakable>

      <div className={styles.switch} role="group" aria-label="Escolher tema">
        {themeOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            className={styles.option}
            aria-pressed={theme === option.id}
            onClick={() => setTheme(option.id)}
          >
            <span aria-hidden="true">{option.icon}</span>
            <span className={styles.optionLabel}>{option.label}</span>
            {theme === option.id && (
              <span className={styles.check} aria-hidden="true">
                ✓
              </span>
            )}
          </button>
        ))}
      </div>

      {theme !== "original" ? (
        <span className={styles.chip}>
          <span className={styles.chipDot} aria-hidden="true" />
          Temporada de Halloween
        </span>
      ) : (
        <span className={styles.caption}>
          <span aria-hidden="true">✨</span>
          Um novo dia para evoluir
        </span>
      )}
    </div>
  );
}
