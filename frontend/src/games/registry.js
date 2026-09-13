import { MemoryMatch } from "./memory-match/MemoryMatch";
import { StroopTest } from "./stroop-test/StroopTest";

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
];
