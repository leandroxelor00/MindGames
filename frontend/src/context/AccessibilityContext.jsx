import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const AccessibilityContext = createContext(null);

const STORAGE_KEYS = {
  altoContraste: "mindgames_alto_contraste",
  fonteEscala: "mindgames_fonte_escala",
  reduzirAnimacoes: "mindgames_reduzir_animacoes",
  vozNarrador: "mindgames_voz_narrador",
  narracaoHover: "mindgames_narracao_hover",
};

function getBooleanStorage(key, defaultValue = false) {
  const value = localStorage.getItem(key);

  if (value === null) {
    return defaultValue;
  }

  return value === "true";
}

function getNumberStorage(key, defaultValue = 1) {
  const value = Number(localStorage.getItem(key));

  if (!Number.isFinite(value)) {
    return defaultValue;
  }

  return Math.min(1.5, Math.max(1, value));
}

export function AccessibilityProvider({ children }) {
  const [altoContraste, setAltoContraste] = useState(() =>
    getBooleanStorage(STORAGE_KEYS.altoContraste),
  );

  const [fonteEscala, setFonteEscala] = useState(() =>
    getNumberStorage(STORAGE_KEYS.fonteEscala, 1),
  );

  const [reduzirAnimacoes, setReduzirAnimacoes] = useState(() =>
    getBooleanStorage(STORAGE_KEYS.reduzirAnimacoes),
  );

  const [vozNarrador, setVozNarrador] = useState(() =>
    getBooleanStorage(STORAGE_KEYS.vozNarrador),
  );

  const [narracaoHover, setNarracaoHover] = useState(() =>
    getBooleanStorage(STORAGE_KEYS.narracaoHover),
  );

  const [vozesDisponiveis, setVozesDisponiveis] = useState([]);

  const narradorInicializado = useRef(false);

  useEffect(() => {
    document.documentElement.dataset.altoContraste =
      String(altoContraste);

    localStorage.setItem(
      STORAGE_KEYS.altoContraste,
      String(altoContraste),
    );
  }, [altoContraste]);

  useEffect(() => {
    const escalaSegura = Math.min(
      1.5,
      Math.max(1, fonteEscala),
    );

    document.documentElement.style.setProperty(
      "--fonte-escala",
      String(escalaSegura),
    );

    localStorage.setItem(
      STORAGE_KEYS.fonteEscala,
      String(escalaSegura),
    );
  }, [fonteEscala]);

  useEffect(() => {
    document.documentElement.dataset.reduzirAnimacoes =
      String(reduzirAnimacoes);

    localStorage.setItem(
      STORAGE_KEYS.reduzirAnimacoes,
      String(reduzirAnimacoes),
    );
  }, [reduzirAnimacoes]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.vozNarrador,
      String(vozNarrador),
    );
  }, [vozNarrador]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.narracaoHover,
      String(narracaoHover),
    );
  }, [narracaoHover]);

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      return undefined;
    }

    function carregarVozes() {
      const vozes = window.speechSynthesis.getVoices();
      setVozesDisponiveis(vozes);
    }

    carregarVozes();

    window.speechSynthesis.addEventListener(
      "voiceschanged",
      carregarVozes,
    );

    return () => {
      window.speechSynthesis.removeEventListener(
        "voiceschanged",
        carregarVozes,
      );
    };
  }, []);

  const speak = useCallback(
    (texto) => {
      if (!texto) {
        return;
      }

      if (!("speechSynthesis" in window)) {
        return;
      }

      const textoLimpo = String(texto).trim();

      if (!textoLimpo) {
        return;
      }

      window.speechSynthesis.cancel();

      const utterance =
        new SpeechSynthesisUtterance(textoLimpo);

      const vozSelecionada =
        vozNarrador !== "automatica"
          ? vozesDisponiveis.find(
              (voz) => voz.name === vozNarrador,
            )
          : null;

      const vozPortuguesBrasil =
        vozesDisponiveis.find(
          (voz) =>
            voz.lang?.toLowerCase() === "pt-br",
        );

      const vozPortugues =
        vozesDisponiveis.find((voz) =>
          voz.lang?.toLowerCase().startsWith("pt"),
        );

      if (vozSelecionada) {
        utterance.voice = vozSelecionada;
      } else if (vozPortuguesBrasil) {
        utterance.voice = vozPortuguesBrasil;
      } else if (vozPortugues) {
        utterance.voice = vozPortugues;
      }

      utterance.lang =
        utterance.voice?.lang || "pt-BR";

      utterance.rate = 1;
      utterance.pitch = 1;

      window.speechSynthesis.speak(utterance);
    },
    [vozesDisponiveis, vozNarrador],
  );

  const stopSpeaking = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const ativarNarrador = useCallback(() => {
    setVozNarrador(true);
    setNarracaoHover(true);

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const utterance =
        new SpeechSynthesisUtterance(
          "Narrador ativado. A narração do MindGames está ativa.",
        );

      const vozPortuguesBrasil =
        vozesDisponiveis.find(
          (voz) =>
            voz.lang?.toLowerCase() === "pt-br",
        );

      const vozPortugues =
        vozesDisponiveis.find((voz) =>
          voz.lang?.toLowerCase().startsWith("pt"),
        );

      if (vozPortuguesBrasil) {
        utterance.voice = vozPortuguesBrasil;
      } else if (vozPortugues) {
        utterance.voice = vozPortugues;
      }

      utterance.lang =
        utterance.voice?.lang || "pt-BR";

      utterance.rate = 1;
      utterance.pitch = 1;

      window.speechSynthesis.speak(utterance);
    }
  }, [vozesDisponiveis]);

  const desativarNarrador = useCallback(() => {
    setVozNarrador(false);
    setNarracaoHover(false);

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const alternarNarrador = useCallback(() => {
    if (vozNarrador) {
      desativarNarrador();
    } else {
      ativarNarrador();
    }
  }, [
    vozNarrador,
    ativarNarrador,
    desativarNarrador,
  ]);

  useEffect(() => {
    if (!narradorInicializado.current) {
      narradorInicializado.current = true;
    }
  }, []);

  const value = useMemo(
    () => ({
      altoContraste,
      setAltoContraste,
      fonteEscala,
      setFonteEscala,
      reduzirAnimacoes,
      setReduzirAnimacoes,
      vozNarrador,
      setVozNarrador,
      narracaoHover,
      setNarracaoHover,
      vozesDisponiveis,
      speak,
      stopSpeaking,
      ativarNarrador,
      desativarNarrador,
      alternarNarrador,
    }),
    [
      altoContraste,
      fonteEscala,
      reduzirAnimacoes,
      vozNarrador,
      narracaoHover,
      vozesDisponiveis,
      speak,
      stopSpeaking,
      ativarNarrador,
      desativarNarrador,
      alternarNarrador,
    ],
  );

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAccessibility() {
  const context = useContext(AccessibilityContext);

  if (!context) {
    throw new Error(
      "useAccessibility deve ser usado dentro de AccessibilityProvider.",
    );
  }

  return context;
}
