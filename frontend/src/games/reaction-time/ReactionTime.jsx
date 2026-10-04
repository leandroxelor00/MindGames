import { useReactionTime } from "./useReactionTime";
import styles from "./ReactionTime.module.css";

export function ReactionTime() {
  const {
    status,
    reactionTime,
    tempos,
    tentativaAtual,
    totalTentativas,
    iniciar,
    clicarTela,
    proximaTentativa,
    tentarNovamente,
    mensagemAcessibilidade,
  } = useReactionTime();

  function handleClickArea() {
    if (status === "idle") {
      iniciar();
      return;
    }

    if (status === "waiting" || status === "ready") {
      clicarTela();
      return;
    }

    if (status === "result") {
      proximaTentativa();
    }
  }

  function handleKeyDown(event) {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();

    if (status === "idle") {
      iniciar();
      return;
    }

    if (status === "waiting" || status === "ready") {
      clicarTela();
      return;
    }

    if (status === "result") {
      proximaTentativa();
    }
  }

  function getMensagem() {
    switch (status) {
      case "idle":
        return "Pressione Enter ou Espaço para começar";

      case "waiting":
        return "Espere a cor mudar...";

      case "ready":
        return "PRESSIONE ENTER OU ESPAÇO AGORA!";

      case "result":
        return "Tentativa concluída. Pressione Enter ou Espaço para continuar.";

      case "tooSoon":
        return "Muito cedo!";

      case "done":
        return "Teste concluído. Tempo médio de reação:";

      default:
        return "";
    }
  }

  function getAriaLabel() {
    switch (status) {
      case "idle":
        return "Teste de tempo de reação. Pressione Enter ou Espaço para começar.";

      case "waiting":
        return `Tentativa ${tentativaAtual + 1} de ${totalTentativas}. Aguarde a mudança de cor.`;

      case "ready":
        return `Tentativa ${tentativaAtual + 1} de ${totalTentativas}. A cor mudou. Pressione Enter ou Espaço agora.`;

      case "result":
        return `Tentativa ${tentativaAtual} de ${totalTentativas} concluída. Pressione Enter ou Espaço para iniciar a próxima tentativa.`;

      case "tooSoon":
        return "Você clicou cedo demais. Use o botão Tentar novamente para reiniciar.";

      case "done":
        return `Teste concluído após ${totalTentativas} tentativas. Tempo médio de reação: ${reactionTime?.toFixed(0)} milissegundos.`;

      default:
        return "Teste de tempo de reação.";
    }
  }

  return (
    <div
      className={`${styles.area} ${styles[status]}`}
      role="button"
      tabIndex={0}
      aria-label={getAriaLabel()}
      onClick={handleClickArea}
      onKeyDown={handleKeyDown}
    >
      <div aria-live="polite" className={styles.leitorTela}>
        {mensagemAcessibilidade}
      </div>

      <div className={styles.conteudo}>
        {status !== "idle" && status !== "done" && (
          <p className={styles.tentativa}>
            Tentativa {tentativaAtual + 1} de {totalTentativas}
          </p>
        )}

        <p className={styles.mensagem}>{getMensagem()}</p>

        {status === "result" && tempos.length > 0 && (
          <p className={styles.tempo}>
            {tempos[tempos.length - 1].toFixed(0)} ms
          </p>
        )}

        {status === "done" && (
          <>
            <p className={styles.tempo}>{reactionTime.toFixed(0)} ms</p>

            <div className={styles.resumo}>
              <p>
                Média após {totalTentativas} tentativas
              </p>

              <div className={styles.resultados}>
                {tempos.map((tempo, index) => (
                  <span key={index}>
                    Tentativa {index + 1}: {tempo.toFixed(0)} ms
                  </span>
                ))}
              </div>
            </div>
          </>
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