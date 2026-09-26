import { useFoodMemory } from "./useFoodMemory";

import { ScoreBoard } from "../../components/ScoreBoard/ScoreBoard";

import styles from "./FoodMemory.module.css";

export function FoodMemory() {
  const {
    fase,
    imagens,
    erros,
    gameOver,
    venceu,
    feedback,
    clicarImagem,
    reiniciarJogo,
  } = useFoodMemory();

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.painel}>
          <ScoreBoard
            items={[
              { label: "Fase", value: fase },
              { label: "Erros", value: `${erros}/3` },
            ]}
          />
        </div>
      </div>
      <div className={styles.area}>
        {imagens.map((imagem) => (
          <button
            key={imagem.id}
            className={`${styles.imagem} ${
              feedback?.id === imagem.id
                ? feedback.tipo === "acerto"
                  ? styles.acerto
                  : styles.erro
                : ""
            }`}
            style={{
              left: `${imagem.x}%`,
              top: `${imagem.y}%`,
            }}
            onClick={() => clicarImagem(imagem.id)}
            disabled={!!feedback}
          >
            {imagem.emoji}
          </button>
        ))}

        {gameOver && (
          <div className={styles.mensagem}>
            {venceu ? (
              <>
                <h2>🎉 Você venceu!</h2>
                <p>Você completou todas as 15 fases!</p>
              </>
            ) : (
              <>
                <h2>💥 Fim de jogo!</h2>
                <p>Você alcançou a fase {fase - 1}.</p>
              </>
            )}

            <button onClick={reiniciarJogo}>Jogar novamente</button>
          </div>
        )}
      </div>
    </div>
  );
}
