import { createContext, useEffect, useState } from "react";
 
// eslint-disable-next-line react-refresh/only-export-components
export const AccessibilityContext = createContext(null);
 
export function AccessibilityProvider({ children }) {
  const [altoContraste, setAltoContraste] = useState(() => {
    return localStorage.getItem("altoContraste") === "true";
  });
 
  const [fonteEscala, setFonteEscala] = useState(() => {
    const valorSalvo = localStorage.getItem("fonteEscala");
    return valorSalvo ? Number(valorSalvo) : 1;
  });
 
  const [reduzirAnimacoes, setReduzirAnimacoes] = useState(() => {
    return localStorage.getItem("reduzirAnimacoes") === "true";
  });
 
  useEffect(() => {
    localStorage.setItem("altoContraste", altoContraste);
  }, [altoContraste]);
 
  useEffect(() => {
    localStorage.setItem("fonteEscala", fonteEscala);
  }, [fonteEscala]);
 
  useEffect(() => {
    localStorage.setItem("reduzirAnimacoes", reduzirAnimacoes);
  }, [reduzirAnimacoes]);
 
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-alto-contraste",
      altoContraste
    );
 
    document.documentElement.setAttribute(
      "data-reduzir-animacoes",
      reduzirAnimacoes
    );
 
    document.documentElement.style.setProperty(
      "--fonte-escala",
      fonteEscala
    );
  }, [altoContraste, fonteEscala, reduzirAnimacoes]);
 
  return (
    <AccessibilityContext.Provider
      value={{
        altoContraste,
        setAltoContraste,
        fonteEscala,
        setFonteEscala,
        reduzirAnimacoes,
        setReduzirAnimacoes,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}