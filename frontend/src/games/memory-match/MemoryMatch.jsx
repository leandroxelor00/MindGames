import { useMemoryMatch } from "./useMemoryMatch";

import styles from "./MemoryMatch.module.css";

import { GameOverModal } from "../../components/GameOverModal/GameOverModal";

import { Timer } from "../../components/Timer/Timer";

import { ScoreBoard } from "../../components/ScoreBoard/ScoreBoard";

export function MemoryMatch() {
  const {
    baralho,
    tentativas,
    segundos,
    memorizando,
    jogoFinalizado,
    virarCarta,
    resetGame,
    mensagemAcessibilidade,
  } = useMemoryMatch();

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Memory Match</h1>
      <div aria-live="polite" className={styles.leitorTela}>
        {mensagemAcessibilidade}
      </div>

      <div className={styles.painel}>
        <ScoreBoard
          items={[
            {
              label: "Tentativas",
              value: tentativas,
            },
          ]}
        />

        <Timer segundos={segundos} />
      </div>

      {memorizando && (
        <div className={styles.mensagemMemoria}>
          Memorize as cartas! O jogo começa em alguns segundos...
        </div>
      )}

      {jogoFinalizado && (
        <GameOverModal
          message={`Parabéns! Você venceu em ${tentativas} tentativas e ${segundos} segundos!`}
          onClick={resetGame}
        />
      )}

      <div className={styles.grade}>
        {baralho.map((carta) => {
          const estaVirada = carta.virada || carta.pareada;

          return (
            <button
              key={carta.id}
              type="button"
              className={`
    ${styles.cartaContainer}
    ${estaVirada ? styles.flipped : ""}
    ${carta.pareada ? styles.pareada : ""}
  `}
              onClick={() => virarCarta(carta.id)}
              aria-label={
                carta.pareada
                  ? `Par encontrado ${carta.valor}`
                  : estaVirada
                    ? `Carta revelada ${carta.valor}`
                    : "Carta escondida"
              }
            >
              <div className={styles.cartaInner}>
                <div className={styles.cartaFront}>❔</div>
                <div className={styles.cartaBack}>{carta.valor}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
