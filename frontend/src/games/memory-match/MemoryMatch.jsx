import { useMemoryMatch } from "./useMemoryMatch";
import styles from "./MemoryMatch.module.css";
import { Timer } from "../../components/Timer/Timer";
 
export function MemoryMatch() {
  const { baralho, tentativas, segundos, jogoFinalizado, virarCarta } =
    useMemoryMatch();
 
  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Memory Match</h1>
 
      <div className={styles.painel}>
        <span>Tentativas: {tentativas}</span>
        <Timer segundos={segundos} />
      </div>
 
      {jogoFinalizado && (
        <div className={styles.mensagemVitoria}>
          🎉 Parabéns! Você venceu em {tentativas} tentativas e {segundos}{" "}
          segundos!
        </div>
      )}
 
      <div className={styles.grade}>
        {baralho.map((carta) => {
          const estaVirada = carta.virada || carta.pareada;
 
          return (
            <div
              key={carta.id}
              className={`
                ${styles.cartaContainer}
                ${estaVirada ? styles.flipped : ""}
                ${carta.pareada ? styles.pareada : ""}
              `}
              onClick={() => {
                if (!carta.virada && !carta.pareada) {
                  virarCarta(carta.id);
                }
              }}
            >
              <div className={styles.cartaInner}>
                <div className={styles.cartaFront}>❔</div>
                <div className={styles.cartaBack}>{carta.valor}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}