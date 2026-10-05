import { createContext, useContext, useEffect, useState } from "react";

const AccessibilityContext = createContext(null);

export function AccessibilityProvider({ children }) {
  const [altoContraste, setAltoContraste] = useState(() => {
    return localStorage.getItem("altoContraste") === "true";
  });

  const [fonteEscala, setFonteEscala] = useState(() => {
    return Number(localStorage.getItem("fonteEscala")) || 1;
  });

  const [reduzirAnimacoes, setReduzirAnimacoes] = useState(() => {
    return localStorage.getItem("reduzirAnimacoes") === "true";
  });

  const [vozNarrador, setVozNarrador] = useState(() => {
    return localStorage.getItem("vozNarrador") || "automatica";
  });

  const [vozesDisponiveis, setVozesDisponiveis] = useState([]);

  useEffect(() => {
    localStorage.setItem("altoContraste", altoContraste);
    document.documentElement.dataset.altoContraste = altoContraste;
  }, [altoContraste]);

  useEffect(() => {
    localStorage.setItem("fonteEscala", fonteEscala);

    document.documentElement.style.setProperty(
      "--fonte-escala",
      fonteEscala,
    );
  }, [fonteEscala]);

  useEffect(() => {
    localStorage.setItem("reduzirAnimacoes", reduzirAnimacoes);
    document.documentElement.dataset.reduzirAnimacoes = reduzirAnimacoes;
  }, [reduzirAnimacoes]);

  useEffect(() => {
    localStorage.setItem("vozNarrador", vozNarrador);
  }, [vozNarrador]);

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    function carregarVozes() {
      const vozes = window.speechSynthesis
        .getVoices()
        .filter((voz) => voz.lang.toLowerCase().startsWith("pt"));

      setVozesDisponiveis(vozes);

      const vozSelecionadaExiste = vozes.some(
        (voz) => voz.name === vozNarrador,
      );

      if (
        vozNarrador !== "automatica" &&
        !vozSelecionadaExiste
      ) {
        setVozNarrador("automatica");
      }
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
  }, [vozNarrador]);

  return (
    <AccessibilityContext.Provider
      value={{
        altoContraste,
        setAltoContraste,

        fonteEscala,
        setFonteEscala,

        reduzirAnimacoes,
        setReduzirAnimacoes,

        vozNarrador,
        setVozNarrador,

        vozesDisponiveis,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAccessibility() {
  return useContext(AccessibilityContext);
}