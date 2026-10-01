import { useStroopTest } from "./useStroopTest";

import styles from "./StroopTest.module.css";

import { Timer } from "../../components/Timer/Timer";

import { ScoreBoard } from "../../components/ScoreBoard/ScoreBoard";

import { GameOverModal } from "../../components/GameOverModal/GameOverModal";


export function StroopTest() {


  const {

    segundos,

    score,

    startTimer,

    currentWord,

    currentColor,

    changeWord,

    colorCorrect,

    avgReactionTime,

    gameOver,

    resetGame,

    mensagemAcessibilidade,

  } = useStroopTest();



  const handleAnswer = (colorName) => {

    if (gameOver) return;

    colorCorrect(colorName);

    changeWord();

    startTimer();

  };



  return (

    <div className={styles.container}>


      <h1 className={styles.titulo}>
        Stroop Test
      </h1>



      <div
        aria-live="polite"
        className={styles.leitorTela}
      >
        {mensagemAcessibilidade}
      </div>



      {gameOver && (

        <GameOverModal

          customStyle={{
            width: 800,
          }}

          message={
            `Fim de jogo! Você fez ${score} pontos 
            com uma média de ${avgReactionTime}ms de reação.`
          }

          onClick={resetGame}

        />

      )}



      <div className={styles.painel}>


        <Timer
          segundos={segundos}
          label="Tempo Restante"
        />


        <ScoreBoard

          items={[
            {
              label:"Pontuação",
              value:score,
            },

            {
              label:"Tempo de reação (média)",
              value:`${avgReactionTime}ms`,
            },
          ]}

        />


      </div>




      <div className={styles.wordDisplay}>

        <p style={{color: currentColor}}>
          {currentWord}
        </p>

      </div>




      <div className={styles.gradeBotoes}>


        <button

          disabled={gameOver}

          className={styles.btnColor}

          aria-label="Escolher cor azul"

          onClick={() => handleAnswer("AZUL")}

        >
          AZUL
        </button>



        <button

          disabled={gameOver}

          className={styles.btnColor}

          aria-label="Escolher cor verde"

          onClick={() => handleAnswer("VERDE")}

        >
          VERDE
        </button>




        <button

          disabled={gameOver}

          className={styles.btnColor}

          aria-label="Escolher cor vermelha"

          onClick={() => handleAnswer("VERMELHO")}

        >
          VERMELHO
        </button>




        <button

          disabled={gameOver}

          className={styles.btnColor}

          aria-label="Escolher cor amarela"

          onClick={() => handleAnswer("AMARELO")}

        >
          AMARELO
        </button>



      </div>


    </div>

  );

}