import { useEffect, useState } from "react";

export function useVisualMemory() {
  const [gridLength, setGridLength] = useState(9);
  const [level, setLevel] = useState(1);
  const [cells, setCells] = useState(3);
  const [highlightedCells, setHighlightedCells] = useState(new Set());
  const min = 0;
  const max = gridLength - 1;

  useEffect(() => {
    generateHighlightedCells();
  }, []);

  function generateGrid() {
    return Array.from({ length: gridLength }, (_, i) => i);
  }

  function randomPos(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function generateHighlightedCells() {
    const newHighlightedCells = new Set();
    while (newHighlightedCells.size < cells) {
      newHighlightedCells.add(randomPos(min, max));
    }
    setHighlightedCells(newHighlightedCells);
  }

  return { generateGrid, highlightedCells };
}
