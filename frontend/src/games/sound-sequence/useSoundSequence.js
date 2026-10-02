import { useRef, useState, useEffect } from "react";
import { getCurrentUserId } from "../../services/userId";
import { postScore } from "../../services/scoreService";

const FREQUENCIAS = {
  ArrowUp: 1000,
  ArrowRight: 700,
  ArrowLeft: 400,
  ArrowDown: 200,
};

const TECLAS = ["ArrowUp", "ArrowRight", "ArrowLeft", "ArrowDown"];

export function useSoundSequence() {
  const audioContextRef = useRef(null);

  const [sequencia, setSequencia] = useState([]);
  const [passoAtual, setPassoAtual] = useState(0);
  const [reproduzindo, setReproduzindo] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [fase, setFase] = useState(0);

  function getAudioContext() {
    if (!audioContextRef.current) {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

      audioContextRef.current = new AudioContextClass();
    }

    return audioContextRef.current;
  }

  function tocarSom(tecla) {
    const frequencia = FREQUENCIAS[tecla];

    if (!frequencia) {
      return;
    }

    const audioContext = getAudioContext();

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const ganho = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequencia;

    // Volume moderado para evitar um som excessivamente forte.
    ganho.gain.value = 0.15;

    oscillator.connect(ganho);
    ganho.connect(audioContext.destination);

    oscillator.start();

    oscillator.stop(audioContext.currentTime + 0.4);
  }

  function narrar(texto) {
    if (!window.speechSynthesis) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = "pt-BR";

    window.speechSynthesis.speak(utterance);
  }

  function adicionarPassoNaSequencia(seqAtual = sequencia) {
    const indiceAleatorio = Math.floor(Math.random() * TECLAS.length);
    const teclaAleatoria = TECLAS[indiceAleatorio];

    const novaSequencia = [...seqAtual, teclaAleatoria];

    setSequencia(novaSequencia);

    return novaSequencia;
  }

  async function reproduzirSequencia(seq) {
    setReproduzindo(true);
    setPassoAtual(0);

    for (const tecla of seq) {
      tocarSom(tecla);

      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    setReproduzindo(false);
    setPassoAtual(0);
  }

  function iniciarJogo() {
    if (fase > 0 && !gameOver) {
      return;
    }
    const primeiraSequencia = adicionarPassoNaSequencia([]);

    setFase(1);
    setPassoAtual(0);
    setGameOver(false);

    if (!window.speechSynthesis) {
      reproduzirSequencia(primeiraSequencia);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(
      "Use as setas do teclado. Seta para cima é o som mais agudo, seta para baixo é o mais grave. Ouça a sequência e repita.",
    );

    utterance.lang = "pt-BR";

    utterance.onend = () => {
      reproduzirSequencia(primeiraSequencia);
    };

    window.speechSynthesis.speak(utterance);
  }

  async function receberTecla(tecla) {
    if (reproduzindo || gameOver || sequencia.length === 0) {
      return;
    }

    if (!FREQUENCIAS[tecla]) {
      return;
    }

    if (tecla === sequencia[passoAtual]) {
      tocarSom(tecla);

      const proximoPasso = passoAtual + 1;

      if (proximoPasso === sequencia.length) {
        const novaSequencia = adicionarPassoNaSequencia();
        setFase((faseAtual) => faseAtual + 1);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        reproduzirSequencia(novaSequencia);
      } else {
        setPassoAtual(proximoPasso);
      }
    } else {
      setGameOver(true);
    }
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (!TECLAS.includes(event.key)) {
        return;
      }

      event.preventDefault();

      const jogoAindaNaoComecou = sequencia.length === 0 && !reproduzindo;

      if (jogoAindaNaoComecou) {
        tocarSom(event.key);
        return;
      }

      receberTecla(event.key);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [sequencia, passoAtual, reproduzindo, gameOver]);

  useEffect(() => {
    if (!gameOver) {
      return;
    }

    async function enviar() {
      const resultado = {
        userId: getCurrentUserId(),
        gameId: "sound-sequence",
        score: fase - 1,
        accuracy: 0,
        avgReactionTime: 0,
        levelReached: fase - 1,
      };

      try {
        await postScore(resultado);
      } catch (error) {
        console.error("Não foi possível enviar o resultado:", error);
      }
    }

    enviar();
  }, [gameOver]);

  return {
    tocarSom,
    narrar,
    sequencia,
    passoAtual,
    reproduzindo,
    gameOver,
    fase,
    iniciarJogo,
  };
}
