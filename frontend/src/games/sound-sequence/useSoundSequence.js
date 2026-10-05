import {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";

import { getCurrentUserId } from "../../services/userId";
import { postScore } from "../../services/scoreService";
import { useAccessibility } from "../../context/AccessibilityContext";

const FREQUENCIAS = {
  ArrowUp: 1000,
  ArrowRight: 700,
  ArrowLeft: 400,
  ArrowDown: 200,
};

const CORES = {
  ArrowUp: "verde",
  ArrowRight: "vermelho",
  ArrowLeft: "azul",
  ArrowDown: "amarelo",
};

const TECLAS = [
  "ArrowUp",
  "ArrowRight",
  "ArrowLeft",
  "ArrowDown",
];

export function useSoundSequence() {
  const { vozNarrador } = useAccessibility();

  const audioContextRef = useRef(null);

  const [sequencia, setSequencia] = useState([]);
  const [passoAtual, setPassoAtual] = useState(0);
  const [reproduzindo, setReproduzindo] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [fase, setFase] = useState(0);
  const [corAtiva, setCorAtiva] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [narradorAtivo, setNarradorAtivo] = useState(true);

  function getAudioContext() {
    if (!audioContextRef.current) {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

      audioContextRef.current = new AudioContextClass();
    }

    return audioContextRef.current;
  }

  const tocarSom = useCallback(async (tecla) => {
    const frequencia = FREQUENCIAS[tecla];

    if (!frequencia) {
      return;
    }

    const audioContext = getAudioContext();

    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    setCorAtiva(CORES[tecla]);

    const oscillator = audioContext.createOscillator();
    const ganho = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequencia;

    const agora = audioContext.currentTime;

    ganho.gain.setValueAtTime(0.0001, agora);
    ganho.gain.exponentialRampToValueAtTime(
      0.15,
      agora + 0.02
    );
    ganho.gain.exponentialRampToValueAtTime(
      0.0001,
      agora + 0.4
    );

    oscillator.connect(ganho);
    ganho.connect(audioContext.destination);

    oscillator.start(agora);
    oscillator.stop(agora + 0.4);

    setTimeout(() => {
      setCorAtiva(null);
    }, 400);
  }, []);

  const obterVozNarrador = useCallback(() => {
    if (!("speechSynthesis" in window)) {
      return null;
    }
  
    const vozes = window.speechSynthesis.getVoices();
  
    if (vozNarrador !== "automatica") {
      const vozSelecionada = vozes.find(
        (voz) => voz.name === vozNarrador
      );
  
      if (vozSelecionada) {
        return vozSelecionada;
      }
    }
  
    return (
      vozes.find(
        (voz) => voz.lang.toLowerCase() === "pt-br"
      ) ||
      vozes.find(
        (voz) => voz.lang.toLowerCase().startsWith("pt")
      ) ||
      null
    );
  }, [vozNarrador]);

  const criarFala = useCallback(
    (texto) => {
      const utterance =
        new SpeechSynthesisUtterance(texto);
  
      const voz = obterVozNarrador();
  
      if (voz) {
        utterance.voice = voz;
        utterance.lang = voz.lang;
      } else {
        utterance.lang = "pt-BR";
      }
  
      return utterance;
    },
    [obterVozNarrador]
  );

  const narrar = useCallback(
    (texto) => {
      if (!narradorAtivo) {
        return;
      }
  
      if (!("speechSynthesis" in window)) {
        return;
      }
  
      window.speechSynthesis.cancel();
  
      const utterance = criarFala(texto);
  
      window.speechSynthesis.speak(utterance);
    },
    [narradorAtivo, criarFala]
  );

  const alternarNarrador = useCallback(() => {
    setNarradorAtivo((ativoAtual) => {
      const novoEstado = !ativoAtual;

      if (
        !novoEstado &&
        "speechSynthesis" in window
      ) {
        window.speechSynthesis.cancel();
      }

      return novoEstado;
    });
  }, []);

  const adicionarPassoNaSequencia = useCallback(
    (seqAtual = sequencia) => {
      const indiceAleatorio = Math.floor(
        Math.random() * TECLAS.length
      );

      const teclaAleatoria = TECLAS[indiceAleatorio];

      const novaSequencia = [
        ...seqAtual,
        teclaAleatoria,
      ];

      setSequencia(novaSequencia);

      return novaSequencia;
    },
    [sequencia]
  );

  const reproduzirSequencia = useCallback(
    async (seq) => {
      setReproduzindo(true);
      setPassoAtual(0);

      for (const tecla of seq) {
        await tocarSom(tecla);

        await new Promise((resolve) =>
          setTimeout(resolve, 750)
        );
      }

      setReproduzindo(false);
      setPassoAtual(0);
    },
    [tocarSom]
  );

  const iniciarJogo = useCallback(() => {
    if (fase > 0 && !gameOver) {
      return;
    }

    const primeiraSequencia =
      adicionarPassoNaSequencia([]);

    setFase(1);
    setPassoAtual(0);
    setGameOver(false);
    setFeedback(null);
    setCorAtiva(null);

    if (
      !narradorAtivo ||
      !("speechSynthesis" in window)
    ) {
      reproduzirSequencia(primeiraSequencia);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = criarFala(
      "Use as setas do teclado. Seta para cima é o som verde mais agudo, seta para baixo é o som amarelo mais grave. Ouça a sequência e repita."
    );

    utterance.onend = () => {
      reproduzirSequencia(primeiraSequencia);
    };

    window.speechSynthesis.speak(utterance);
  }, [
    fase,
    gameOver,
    adicionarPassoNaSequencia,
    narradorAtivo,
    reproduzirSequencia,
    criarFala,
  ]);

  const receberTecla = useCallback(
    async (tecla) => {
      if (
        reproduzindo ||
        gameOver ||
        sequencia.length === 0
      ) {
        return;
      }

      if (!FREQUENCIAS[tecla]) {
        return;
      }

      if (tecla === sequencia[passoAtual]) {
        await tocarSom(tecla);

        setFeedback("acerto");

        setTimeout(() => {
          setFeedback(null);
        }, 300);

        const proximoPasso = passoAtual + 1;

        if (proximoPasso === sequencia.length) {
          const novaSequencia =
            adicionarPassoNaSequencia();

          setFase(
            (faseAtual) => faseAtual + 1
          );

          await new Promise((resolve) =>
            setTimeout(resolve, 1000)
          );

          reproduzirSequencia(novaSequencia);
        } else {
          setPassoAtual(proximoPasso);
        }
      } else {
        setCorAtiva(null);
        setFeedback("erro");
        setGameOver(true);
      }
    },
    [
      reproduzindo,
      gameOver,
      sequencia,
      passoAtual,
      tocarSom,
      adicionarPassoNaSequencia,
      reproduzirSequencia,
    ]
  );

  const testarTecla = useCallback(
    (tecla) => {
      if (!TECLAS.includes(tecla)) {
        return;
      }

      const jogoAindaNaoComecou =
        sequencia.length === 0 && !reproduzindo;

      if (jogoAindaNaoComecou) {
        tocarSom(tecla);
      }
    },
    [sequencia, reproduzindo, tocarSom]
  );

  const pressionarTecla = useCallback(
    (tecla) => {
      if (!TECLAS.includes(tecla)) {
        return;
      }

      const jogoAindaNaoComecou =
        sequencia.length === 0 && !reproduzindo;

      if (jogoAindaNaoComecou) {
        testarTecla(tecla);
        return;
      }

      receberTecla(tecla);
    },
    [
      sequencia,
      reproduzindo,
      testarTecla,
      receberTecla,
    ]
  );

  useEffect(() => {
    function handleKeyDown(event) {
      if (!TECLAS.includes(event.key)) {
        return;
      }

      event.preventDefault();

      pressionarTecla(event.key);
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [pressionarTecla]);

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
        console.error(
          "Não foi possível enviar o resultado:",
          error
        );
      }
    }

    enviar();
  }, [gameOver, fase]);

  // Cancela qualquer fala quando o usuário
  // sair da tela do jogo.
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    tocarSom,
    narrar,
    pressionarTecla,
    corAtiva,
    feedback,
    reproduzindo,
    gameOver,
    fase,
    iniciarJogo,
    narradorAtivo,
    alternarNarrador,
  };
}