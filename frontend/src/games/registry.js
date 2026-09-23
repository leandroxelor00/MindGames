import { MemoryMatch } from "./memory-match/MemoryMatch";
import { StroopTest } from "./stroop-test/StroopTest";
import { NumberChallenge } from "./number-challenge/NumberChallenge";

export const gamesRegistry = [
  {
    id: "memory-match",
    name: "Jogo da memoria",
    component: MemoryMatch,
  },
  {
    id: "stroop-test",
    name: "Stroop Teste",
    component: StroopTest,
  },
  {
    id: "number-challenge",
    name: "Desafio Numérico",
    component: NumberChallenge
  }
];
