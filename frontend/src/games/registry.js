import { MemoryMatch } from "./memory-match/MemoryMatch";
import { StroopTest } from "./stroop-test/StroopTest";
import { VisualMemory } from "./visual-memory/VisualMemory";

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
    id: "visual-memory",
    name: "Memoria Visual",
    component: VisualMemory,
  },
];
