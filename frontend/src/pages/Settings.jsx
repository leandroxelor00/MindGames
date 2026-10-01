import { useAccessibility } from "../hooks/useAccessibility";
import { Link } from "react-router-dom";

import styles from "./Settings.module.css";

export function Settings() {
  const {
    altoContraste,
    setAltoContraste,
    fonteEscala,
    setFonteEscala,
    reduzirAnimacoes,
    setReduzirAnimacoes,
  } = useAccessibility();

  return (
    <div className={styles.container}>
      <header className={styles.topo}>
        <h1 className={styles.titulo}>Acessibilidade</h1>

        <Link to="/" className={styles.voltarLink}>
          Voltar para Home
        </Link>
      </header>

      <main className={styles.card}>
        <p className={styles.descricao}>
          Personalize a experiência do MindGames de acordo com suas
          necessidades.
        </p>

        <div className={styles.opcoes}>
          <div className={styles.opcao}>
            <div className={styles.info}>
              <span className={styles.nome}>Alto contraste</span>
              <span className={styles.detalhe}>
                Aumenta o contraste entre o fundo, textos e elementos da
                interface.
              </span>
            </div>

            <input
              className={styles.checkbox}
              type="checkbox"
              checked={altoContraste}
              onChange={(e) => setAltoContraste(e.target.checked)}
            />
          </div>

          <div className={styles.opcao}>
            <div className={styles.info}>
              <span className={styles.nome}>Reduzir animações</span>
              <span className={styles.detalhe}>
                Reduz transições e animações da interface.
              </span>
            </div>

            <input
              className={styles.checkbox}
              type="checkbox"
              checked={reduzirAnimacoes}
              onChange={(e) => setReduzirAnimacoes(e.target.checked)}
            />
          </div>

          <div className={styles.opcao}>
            <div className={styles.info}>
              <span className={styles.nome}>Tamanho da fonte</span>
              <span className={styles.detalhe}>
                Ajuste o tamanho dos textos da aplicação.
              </span>
            </div>

            <div className={styles.sliderContainer}>
              <input
                className={styles.slider}
                type="range"
                min={1}
                max={1.5}
                step={0.1}
                value={fonteEscala}
                onChange={(e) =>
                  setFonteEscala(Number(e.target.value))
                }
                aria-label="Tamanho da fonte"
              />

              <span className={styles.valorFonte}>
                {Math.round(fonteEscala * 100)}%
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}