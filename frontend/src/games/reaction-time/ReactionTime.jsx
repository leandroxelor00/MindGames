import { useReactionTime } from "./useReactionTime";
import styles from "./ReactionTime.module.css";

export function ReactionTime() {
  const {
    status,
    reactionTime,
    iniciar,
    clicarTela,
    tentarNovamente,
  } = useReactionTime();

  function handleClickArea() {
    clicarTela();
  }

  function getMensagem() {
    switch (status) {
      case "idle":
        return "Clique em Começar";

      case "waiting":
        return "Espere a cor mudar...";

      case "ready":
        return "CLIQUE AGORA!";

      case "tooSoon":
        return "Muito cedo!";

      case "done":
        return "Seu tempo de reação:";

      default:
        return "";
    }
  }

  return (
    <div
      className={`${styles.area} ${styles[status]}`}
      onClick={handleClickArea}
    >
      <div className={styles.conteudo}>
        <p className={styles.mensagem}>{getMensagem()}</p>

        {status === "done" && (
          <p className={styles.tempo}>
            {reactionTime.toFixed(0)} ms
          </p>
        )}

        {status === "idle" && (
          <button
            className={styles.botao}
            onClick={(event) => {
              event.stopPropagation();
              iniciar();
            }}
          >
            Começar
          </button>
        )}

        {status === "tooSoon" && (
          <button
            className={styles.botao}
            onClick={(event) => {
              event.stopPropagation();
              tentarNovamente();
            }}
          >
            Tentar novamente
          </button>
        )}

        {status === "done" && (
          <button
            className={styles.botao}
            onClick={(event) => {
              event.stopPropagation();
              tentarNovamente();
            }}
          >
            Jogar novamente
          </button>
        )}
      </div>
    </div>
  );
}