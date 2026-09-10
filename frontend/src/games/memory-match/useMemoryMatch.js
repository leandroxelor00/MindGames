import { useState, useEffect } from "react";
export function criarBaralho() {
  const valores = ["🍎", "🍌", "🍇", "🍒", "🍉", "🍓", "🍍", "🥝"];
  const cartas = [...valores, ...valores];
  cartas.sort(() => Math.random() - 0.5);
  return cartas.map((valor, index) => ({
    id: index,
    valor: valor,
    virada: false,
    pareada: false,
  }));
}
export function useMemoryMatch() {
  const [baralho, setBaralho] = useState(criarBaralho());
  const [viradasAgora, setViradasAgora] = useState([]);
  const [tentativas, setTentativas] = useState(0);
  const [segundos, setSegundos] = useState(0);
  // Valor derivado: verifica se todas as cartas foram pareadas
  const jogoFinalizado = baralho.every((carta) => carta.pareada);
  function virarCarta(id) {
    if (viradasAgora.length >= 2) {
      return;
    }
    const carta = baralho.find((carta) => carta.id === id);
    if (!carta || carta.virada || carta.pareada) {
      return;
    }
    const novoBaralho = baralho.map((carta) => {
      if (carta.id === id) {
        return { ...carta, virada: true };
      }
      return carta;
    });
    setBaralho(novoBaralho);
    setViradasAgora([...viradasAgora, id]);
  }
  // Compara as duas cartas selecionadas
  useEffect(() => {
    if (viradasAgora.length !== 2) {
      return;
    }
    const [id1, id2] = viradasAgora;
    const timer = setTimeout(() => {
      setTentativas((tentativasAtuais) => tentativasAtuais + 1);
      setBaralho((baralhoAtual) => {
        const carta1 = baralhoAtual.find((carta) => carta.id === id1);
        const carta2 = baralhoAtual.find((carta) => carta.id === id2);
        if (!carta1 || !carta2) {
          return baralhoAtual;
        }
        const saoIguais = carta1.valor === carta2.valor;
        return baralhoAtual.map((carta) => {
          if (carta.id === id1 || carta.id === id2) {
            if (saoIguais) {
              return { ...carta, pareada: true };
            }
            return { ...carta, virada: false };
          }
          return carta;
        });
      });
      setViradasAgora([]);
    }, 800);
    return () => clearTimeout(timer);
  }, [viradasAgora]);
  // Cronômetro
  useEffect(() => {
    if (jogoFinalizado) {
      return;
    }
    const intervalo = setInterval(() => {
      setSegundos((segundosAtuais) => segundosAtuais + 1);
    }, 1000);
    return () => {
      clearInterval(intervalo);
    };
  }, [jogoFinalizado]);
  return {
    baralho,
    viradasAgora,
    tentativas,
    segundos,
    jogoFinalizado,
    virarCarta,
  };
}
