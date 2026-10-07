export const MAX_LEVEL = 15;
export const REACTION_BEST_MS = 150;
export const REACTION_WORST_MS = 500;

export const games = {
  "memory-match": { category: "memory", rule: "accuracy" },
  "visual-memory": { category: "memory", rule: "level" },
  "food-memory": { category: "memory", rule: "level" },
  "stroop-test": { category: "attention", rule: "target", target: 25 },
  "number-challenge": { category: "logic", rule: "target", target: 20 },
  "priority-tower": { category: "logic", rule: "target", target: 20 },
  "reaction-time": { category: "velocity", rule: "reaction" },
  "sound-sequence": { category: "memory", rule: "level" },
};
