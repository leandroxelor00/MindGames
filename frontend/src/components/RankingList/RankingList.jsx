import styles from "./RankingList.module.css";

const MEDALHAS = { 1: "🥇", 2: "🥈", 3: "🥉" };

export function RankingList({
  items = [],
  usernameAtual = null,
  mostrarPartidas = true,
}) {
  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <span aria-hidden="true">🏆</span>
        <p>Ainda não há jogadores no ranking.</p>
      </div>
    );
  }

  return (
    <ol className={styles.list}>
      {items.map((item) => {
        const isMe = usernameAtual && item.username === usernameAtual;

        return (
          <li
            key={`${item.posicao}-${item.username}`}
            className={`${styles.row} ${isMe ? styles.me : ""}`}
            aria-current={isMe ? "true" : undefined}
          >
            <span className={styles.position}>
              {MEDALHAS[item.posicao] ? (
                <>
                  <span aria-hidden="true">{MEDALHAS[item.posicao]}</span>
                  <span className={styles.srOnly}>{item.posicao}º lugar</span>
                </>
              ) : (
                `${item.posicao}º`
              )}
            </span>

            <span className={styles.name}>
              {item.username}
              {isMe && <span className={styles.youTag}>você</span>}
            </span>

            <span className={styles.points}>
              {item.pontos.toLocaleString("pt-BR")} pts
              {mostrarPartidas && (
                <span className={styles.matches}>
                  {item.partidas} {item.partidas === 1 ? "partida" : "partidas"}
                </span>
              )}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
