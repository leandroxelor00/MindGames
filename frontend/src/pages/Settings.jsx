import { Link } from "react-router-dom";

import { useAccessibility } from "../context/AccessibilityContext";

import styles from "./Settings.module.css";

export function Settings() {
  const {
    altoContraste,
    setAltoContraste,
    reduzirAnimacoes,
    setReduzirAnimacoes,
    fonteEscala,
    setFonteEscala,
    vozNarrador,
    setVozNarrador,
    vozesDisponiveis,
  } = useAccessibility();

  return (
    <main className={styles.container}>
      <div className={styles.topo}>
        <h1 className={styles.titulo}>Acessibilidade</h1>

        <Link to="/" className={styles.voltarLink}>
          Voltar
        </Link>
      </div>

      <section className={styles.card}>
        <p className={styles.descricao}>
          Personalize a experiência do MindGames de acordo com suas necessidades
          de acessibilidade.
        </p>

        <div className={styles.opcoes}>
          <div className={styles.opcao}>
            <div className={styles.info}>
              <label htmlFor="alto-contraste" className={styles.nome}>
                Alto contraste
              </label>

              <span className={styles.detalhe}>
                Aumenta o contraste das cores da interface.
              </span>
            </div>

            <input
              id="alto-contraste"
              className={styles.checkbox}
              type="checkbox"
              checked={altoContraste}
              onChange={(event) => setAltoContraste(event.target.checked)}
            />
          </div>

          <div className={styles.opcao}>
            <div className={styles.info}>
              <label htmlFor="reduzir-animacoes" className={styles.nome}>
                Reduzir animações
              </label>

              <span className={styles.detalhe}>
                Diminui transições e animações da interface.
              </span>
            </div>

            <input
              id="reduzir-animacoes"
              className={styles.checkbox}
              type="checkbox"
              checked={reduzirAnimacoes}
              onChange={(event) => setReduzirAnimacoes(event.target.checked)}
            />
          </div>

          <div className={styles.opcao}>
            <div className={styles.info}>
              <label htmlFor="tamanho-fonte" className={styles.nome}>
                Tamanho da fonte
              </label>

              <span className={styles.detalhe}>
                Ajuste o tamanho dos textos da interface.
              </span>
            </div>

            <div className={styles.sliderContainer}>
              <input
                id="tamanho-fonte"
                className={styles.slider}
                type="range"
                min="1"
                max="1.5"
                step="0.1"
                value={fonteEscala}
                onChange={(event) => setFonteEscala(Number(event.target.value))}
                aria-label="Tamanho da fonte"
              />

              <span className={styles.valorFonte}>
                {Math.round(fonteEscala * 100)}%
              </span>
            </div>
          </div>

          <div className={styles.opcao}>
            <div className={styles.info}>
              <label htmlFor="voz-narrador" className={styles.nome}>
                Voz do narrador
              </label>

              <span className={styles.detalhe}>
                Escolha a voz utilizada pelos jogos com narração.
              </span>
            </div>

            <select
              id="voz-narrador"
              className={styles.selectVoz}
              value={vozNarrador}
              onChange={(event) => setVozNarrador(event.target.value)}
            >
              <option value="automatica">Automática</option>

              {vozesDisponiveis.map((voz) => (
                <option key={`${voz.name}-${voz.lang}`} value={voz.name}>
                  {voz.name} ({voz.lang})
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>
    </main>
  );
}
