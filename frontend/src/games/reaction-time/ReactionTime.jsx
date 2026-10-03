import { useReactionTime } from "./useReactionTime";

import styles from "./ReactionTime.module.css";

export function ReactionTime() {
  const {
    status,
    reactionTime,
    iniciar,
    clicarTela,
    tentarNovamente,
    mensagemAcessibilidade,
  } = useReactionTime();

  function handleClickArea() {
    if (status === "idle") {
      iniciar();

      return;
    }

    clicarTela();
  }

  function getMensagem() {
    switch (status) {
      case "idle":
        return "Clique para começar";

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
      role="button"
      tabIndex={0}
      aria-label="Teste de tempo de reação. Clique para iniciar ou responder."
      onClick={handleClickArea}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          handleClickArea();
        }
      }}
    >
      <div aria-live="polite" className={styles.leitorTela}>
        {mensagemAcessibilidade}
      </div>

      <div className={styles.conteudo}>
        <p className={styles.mensagem}>{getMensagem()}</p>

        {status === "done" && (
          <p className={styles.tempo}>{reactionTime.toFixed(0)} ms</p>
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
