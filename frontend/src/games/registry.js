import { MemoryMatch } from "./memory-match/MemoryMatch";
import { StroopTest } from "./stroop-test/StroopTest";
import { NumberChallenge } from "./number-challenge/NumberChallenge";
import { VisualMemory } from "./visual-memory/VisualMemory";
import { FoodMemory } from "./food-memory/FoodMemory";
import { ReactionTime } from "./reaction-time/ReactionTime";
import { SoundSequence } from "./sound-sequence/SoundSequence";
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
    component: NumberChallenge,
  },
  {
    id: "visual-memory",
    name: "Memoria Visual",
    component: VisualMemory,
  },
  {
    id: "food-memory",
    name: "Food Memory",
    component: FoodMemory,
  },
  {
    id: "reaction-time",
    name: "Reaction Time",
    component: ReactionTime,
  },
  {
    id: "sound-sequence",
    name: "Sound Sequence",
    component: SoundSequence,
  },
];
