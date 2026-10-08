import { lazy } from "react";

export const gameComponents = {
  "memory-match": lazy(() =>
    import("./memory-match/MemoryMatch.jsx").then((m) => ({ default: m.MemoryMatch }))
  ),
  "stroop-test": lazy(() =>
    import("./stroop-test/StroopTest.jsx").then((m) => ({ default: m.StroopTest }))
  ),
  "number-challenge": lazy(() =>
    import("./number-challenge/NumberChallenge.jsx").then((m) => ({ default: m.NumberChallenge }))
  ),
  "priority-tower": lazy(() =>
    import("./priority-tower/PriorityTower.jsx").then((m) => ({ default: m.PriorityTower }))
  ),
  "visual-memory": lazy(() =>
    import("./visual-memory/VisualMemory.jsx").then((m) => ({ default: m.VisualMemory }))
  ),
  "food-memory": lazy(() =>
    import("./food-memory/FoodMemory.jsx").then((m) => ({ default: m.FoodMemory }))
  ),
  "reaction-time": lazy(() =>
    import("./reaction-time/ReactionTime.jsx").then((m) => ({ default: m.ReactionTime }))
  ),
  "sound-sequence": lazy(() =>
    import("./sound-sequence/SoundSequence.jsx").then((m) => ({ default: m.SoundSequence }))
  ),
};