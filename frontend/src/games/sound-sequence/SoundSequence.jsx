import { useSoundSequence } from "./useSoundSequence";

import { Speakable } from "../../components/Speakable/Speakable";

import styles from "./SoundSequence.module.css";

export function SoundSequence() {
  const {
    reproduzindo,
    gameOver,
    fase,
    corAtiva,
    feedback,
    iniciarJogo,
    pressionarTecla,
    narradorAtivo,
    alternarNarrador,
  } = useSoundSequence();

  const classeFeedback =
    feedback === "acerto"
      ? styles.feedbackAcerto
      : feedback === "erro"
        ? styles.feedbackErro
        : "";

  const textoEstado =
    fase === 0
      ? "Pressione Começar, ou aperte as setas ou as cores livremente para ouvir os sons."
      : reproduzindo
        ? "Ouça a sequência..."
        : feedback === "acerto"
          ? "Acerto!"
          : feedback === "erro"
            ? "Erro! Fim de jogo."
            : "Sua vez! Repita a sequência.";

  return (
    <main className={styles.container}>
      <Speakable
        as="h1"
        text="Sequência de Sons. Jogo de memória auditiva do MindGames."
      >
        <h1>Sequência de Sons</h1>
      </Speakable>

      <Speakable
        as="p"
        text="Ouça a sequência de sons e repita usando as setas do teclado. Cada seta corresponde a uma cor e a um som diferente."
      >
        <p>
          Ouça a sequência de sons e repita usando as setas do teclado.
          <br />
          Cada seta corresponde a uma cor e a um som diferente.
        </p>
      </Speakable>

      <Speakable
        as="p"
        text="Seta para cima: verde. Seta para a direita: vermelho. Seta para a esquerda: azul. Seta para baixo: amarelo."
      >
        <p>
          ↑ Verde · → Vermelho · ← Azul · ↓ Amarelo
        </p>
      </Speakable>

      <Speakable
        as="div"
        text="Painel de sequência de sons. Use as setas do teclado ou os botões coloridos para jogar."
      >
        <div
          className={`${styles.genius} ${classeFeedback}`}
          role="group"
          aria-label="Painel de sequência de sons"
        >
          <Speakable
            as="span"
            text="Verde. Seta para cima. Som mais agudo."
          >
            <button
              type="button"
              className={`${styles.setor} ${styles.verde} ${
                corAtiva === "verde" ? styles.ativo : ""
              }`}
              aria-label="Verde, seta para cima"
              onClick={() => pressionarTecla("ArrowUp")}
              disabled={reproduzindo || gameOver}
            >
              <span aria-hidden="true">↑</span>
            </button>
          </Speakable>

          <Speakable
            as="span"
            text="Vermelho. Seta para a direita."
          >
            <button
              type="button"
              className={`${styles.setor} ${styles.vermelho} ${
                corAtiva === "vermelho" ? styles.ativo : ""
              }`}
              aria-label="Vermelho, seta para a direita"
              onClick={() => pressionarTecla("ArrowRight")}
              disabled={reproduzindo || gameOver}
            >
              <span aria-hidden="true">→</span>
            </button>
          </Speakable>

          <Speakable
            as="span"
            text="Azul. Seta para a esquerda."
          >
            <button
              type="button"
              className={`${styles.setor} ${styles.azul} ${
                corAtiva === "azul" ? styles.ativo : ""
              }`}
              aria-label="Azul, seta para a esquerda"
              onClick={() => pressionarTecla("ArrowLeft")}
              disabled={reproduzindo || gameOver}
            >
              <span aria-hidden="true">←</span>
            </button>
          </Speakable>

          <Speakable
            as="span"
            text="Amarelo. Seta para baixo. Som mais grave."
          >
            <button
              type="button"
              className={`${styles.setor} ${styles.amarelo} ${
                corAtiva === "amarelo" ? styles.ativo : ""
              }`}
              aria-label="Amarelo, seta para baixo"
              onClick={() => pressionarTecla("ArrowDown")}
              disabled={reproduzindo || gameOver}
            >
              <span aria-hidden="true">↓</span>
            </button>
          </Speakable>

          <div
            className={styles.centro}
            aria-hidden="true"
          >
            <span>🎵</span>
          </div>
        </div>
      </Speakable>

      {fase > 0 && (
        <Speakable
          as="p"
          text={`Fase atual: ${fase}.`}
        >
          <p className={styles.fase}>
            Fase: {fase}
          </p>
        </Speakable>
      )}

      <Speakable
        as="p"
        text={textoEstado}
      >
        <p aria-live="polite">
          {textoEstado}
        </p>
      </Speakable>

      <Speakable
        as="span"
        text={
          narradorAtivo
            ? "Narrador do jogo ligado. Botão para desligar o narrador."
            : "Narrador do jogo desligado. Botão para ligar o narrador."
        }
      >
        <button
          type="button"
          className={styles.botao}
          onClick={alternarNarrador}
          aria-pressed={narradorAtivo}
          aria-label={
            narradorAtivo
              ? "Desativar narrador do jogo"
              : "Ativar narrador do jogo"
          }
        >
          {narradorAtivo
            ? "🔊 Narrador: ligado"
            : "🔇 Narrador: desligado"}
        </button>
      </Speakable>

      {!gameOver && (
        <Speakable
          as="span"
          text={
            fase > 0
              ? "O jogo já começou."
              : "Começar jogo. O narrador explicará as instruções antes da primeira sequência."
          }
        >
          <button
            type="button"
            className={styles.botao}
            onClick={iniciarJogo}
            disabled={fase > 0}
          >
            Começar
          </button>
        </Speakable>
      )}

      {gameOver && (
        <Speakable
          as="section"
          text={`Fim de jogo. Você alcançou a fase ${fase - 1}.`}
        >
          <section aria-live="polite">
            <h2>Fim de jogo!</h2>

            <p>
              Você alcançou a fase {fase - 1}.
            </p>

            <Speakable
              as="span"
              text="Jogar novamente. Inicia uma nova partida."
            >
              <button
                type="button"
                className={styles.botao}
                onClick={iniciarJogo}
              >
                Jogar novamente
              </button>
            </Speakable>
          </section>
        </Speakable>
      )}
    </main>
  );
}