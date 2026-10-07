import { useEffect, useRef, useState } from "react";
import { buildScorePayload } from "../../services/scorePayload";
import { postScore } from "../../services/scoreService";
import { useNotification } from "../../context/NotificationContext";

const TIME_LIMIT = 60;
const MAX_LEVEL = 5;
const ITEMS = [
  { id: "banana", name: "Banana", icon: "🍌" },
  { id: "apple", name: "Maçã", icon: "🍎" },
  { id: "grape", name: "Uva", icon: "🍇" },
  { id: "strawberry", name: "Morango", icon: "🍓" },
  { id: "orange", name: "Laranja", icon: "🍊" },
  { id: "pear", name: "Pera", icon: "🍐" },
  { id: "lemon", name: "Limão", icon: "🍋" },
  { id: "watermelon", name: "Melancia", icon: "🍉" },
  { id: "peach", name: "Pêssego", icon: "🍑" },
  { id: "cherry", name: "Cereja", icon: "🍒" },
];

function shuffle(items) {
  const resultado = [...items];

  for (let i = resultado.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [resultado[i], resultado[j]] = [resultado[j], resultado[i]];
  }

  return resultado;
}

function sampleItems(level) {
  const amount = Math.min(4 + Math.floor((level - 1) / 1), 7);
  return shuffle(ITEMS).slice(0, amount);
}

function getPosition(order, id) {
  return order.findIndex((item) => item.id === id);
}

function addUniqueCandidate(candidates, seen, candidate) {
  if (seen.has(candidate.text)) return;

  seen.add(candidate.text);
  candidates.push(candidate);
}

function createClueCandidates(solution) {
  const candidates = [];
  const seen = new Set();

  const addPositionClue = (item) => {
    const position = getPosition(solution, item.id);

    addUniqueCandidate(candidates, seen, {
      type: "position",
      text: `${item.name} está em ${position + 1}º lugar.`,
      test: (order) => getPosition(order, item.id) === position,
    });
  };

  solution.forEach(addPositionClue);

  for (let index = 0; index < solution.length - 1; index += 1) {
    const first = solution[index];
    const second = solution[index + 1];

    addUniqueCandidate(candidates, seen, {
      type: "adjacent",
      text: `${first.name} vem imediatamente antes de ${second.name}.`,
      test: (order) =>
        getPosition(order, second.id) === getPosition(order, first.id) + 1,
    });
  }

  for (let index = 0; index < solution.length - 2; index += 1) {
    const first = solution[index];
    const second = solution[index + 2];

    addUniqueCandidate(candidates, seen, {
      type: "distance",
      text: `${first.name} está duas posições antes de ${second.name}.`,
      test: (order) =>
        getPosition(order, second.id) === getPosition(order, first.id) + 2,
    });
  }

  const pairCandidates = [];

  for (let firstIndex = 0; firstIndex < solution.length; firstIndex += 1) {
    for (
      let secondIndex = firstIndex + 1;
      secondIndex < solution.length;
      secondIndex += 1
    ) {
      pairCandidates.push([solution[firstIndex], solution[secondIndex]]);
    }
  }

  shuffle(pairCandidates)
    .slice(0, Math.min(6, pairCandidates.length))
    .forEach(([first, second]) => {
      addUniqueCandidate(candidates, seen, {
        type: "before",
        text: `${first.name} vem antes de ${second.name}.`,
        test: (order) =>
          getPosition(order, first.id) < getPosition(order, second.id),
      });
    });

  const betweenCandidates = [];

  for (let middleIndex = 1; middleIndex < solution.length - 1; middleIndex += 1) {
    betweenCandidates.push({
      middle: solution[middleIndex],
      left: solution[middleIndex - 1],
      right: solution[middleIndex + 1],
    });
  }

  shuffle(betweenCandidates)
    .slice(0, 3)
    .forEach(({ middle, left, right }) => {
      addUniqueCandidate(candidates, seen, {
        type: "between",
        text: `${middle.name} está entre ${left.name} e ${right.name}.`,
        test: (order) => {
          const currentMiddle = getPosition(order, middle.id);
          const currentLeft = getPosition(order, left.id);
          const currentRight = getPosition(order, right.id);

          return (
            (currentLeft < currentMiddle && currentMiddle < currentRight) ||
            (currentRight < currentMiddle && currentMiddle < currentLeft)
          );
        },
      });
    });

  return shuffle(candidates);
}

function generatePermutations(items) {
  const permutations = [];

  function visit(order, remaining) {
    if (remaining.length === 0) {
      permutations.push(order);
      return;
    }

    for (let index = 0; index < remaining.length; index += 1) {
      visit(
        [...order, remaining[index]],
        [
          ...remaining.slice(0, index),
          ...remaining.slice(index + 1),
        ],
      );
    }
  }

  visit([], items);
  return permutations;
}

function buildClues(items, solution, level) {
  const targetCount = Math.min(3 + level, 6);
  const allOrders = generatePermutations(items);
  const candidates = createClueCandidates(solution);
  const selected = [];
  let possibleOrders = allOrders;

  while (selected.length < targetCount && candidates.length > 0) {
    let bestCandidate = null;
    let bestPossibleOrders = null;

    for (const candidate of candidates) {
      const matching = possibleOrders.filter((order) => candidate.test(order));

      if (
        matching.length > 0 &&
        (bestPossibleOrders === null || matching.length < bestPossibleOrders.length)
      ) {
        bestCandidate = candidate;
        bestPossibleOrders = matching;
      }
    }

    if (!bestCandidate) break;

    selected.push(bestCandidate);
    possibleOrders = bestPossibleOrders;

    const index = candidates.indexOf(bestCandidate);
    candidates.splice(index, 1);
  }

  if (possibleOrders.length > 1) {
    for (const candidate of createClueCandidates(solution)) {
      if (selected.includes(candidate)) continue;

      const matching = possibleOrders.filter((order) => candidate.test(order));

      if (matching.length > 0) {
        selected.push(candidate);
        possibleOrders = matching;
      }

      if (possibleOrders.length === 1) break;
    }
  }

  if (selected.length < 3) {
    for (const candidate of createClueCandidates(solution)) {
      if (selected.some((item) => item.text === candidate.text)) continue;
      selected.push(candidate);
      if (selected.length >= 3) break;
    }
  }

  return shuffle(selected).slice(0, targetCount);
}

function createPuzzle(level) {
  const items = sampleItems(level);
  const solution = shuffle(items);
  const clues = buildClues(items, solution, level);

  return {
    items: shuffle(items),
    solution,
    clues,
  };
}

export function usePriorityTower() {
  const [puzzle, setPuzzle] = useState(() => createPuzzle(1));
  const [selectedItems, setSelectedItems] = useState([]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [correctRounds, setCorrectRounds] = useState(0);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [timer, setTimer] = useState(TIME_LIMIT);
  const [isTimerOn, setIsTimerOn] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [message, setMessage] = useState(
    "Descubra a ordem usando as pistas e monte a torre do primeiro ao último lugar.",
  );

  const roundStartRef = useRef(performance.now());
  const submittedRef = useRef(false);
  const transitionTimeoutRef = useRef(null);
  const scoreRef = useRef(0);
  const attemptsRef = useRef(0);
  const correctRoundsRef = useRef(0);

  const gameOver = timer === 0;
  const level = Math.min(1 + Math.floor(correctRounds / 3), MAX_LEVEL);

  const { notificar } = useNotification();

  useEffect(() => {
    scoreRef.current = score;
    attemptsRef.current = attempts;
    correctRoundsRef.current = correctRounds;
  }, [score, attempts, correctRounds]);

  useEffect(() => {
    if (!isTimerOn || gameOver) return;

    const interval = setInterval(() => {
      setTimer((previousTimer) => {
        if (previousTimer <= 1) {
          setIsTimerOn(false);
          setMessage(
            `Tempo encerrado. Você acertou ${correctRoundsRef.current} desafio(s).`,
          );
          return 0;
        }

        return previousTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameOver, isTimerOn]);

  useEffect(() => {
    if (!gameOver || submittedRef.current) return;

    submittedRef.current = true;

    async function sendScore() {
      const accuracy =
        attemptsRef.current > 0
          ? (correctRoundsRef.current / attemptsRef.current) * 100
          : 0;

      const totalReactionTime = reactionTimes.reduce(
        (total, value) => total + value,
        0,
      );

      const avgReactionTime =
        reactionTimes.length > 0
          ? Number((totalReactionTime / reactionTimes.length).toFixed(2))
          : 0;

      const result = buildScorePayload("priority-tower", {
        score: scoreRef.current,
        accuracy,
        avgReactionTime,
        levelReached: level,
      });

      try {
        await postScore(result);
      } catch (error) {
        console.error("Não foi possível enviar o resultado:", error);
        notificar(
          "Não foi possível salvar sua pontuação. Verifique sua conexão.",
        );
      }
    }

    sendScore();
  }, [gameOver, level, notificar, reactionTimes]);

  function startTimerIfNeeded() {
    if (gameOver || isTimerOn) return;

    setIsTimerOn(true);
    roundStartRef.current = performance.now();
    setMessage("O tempo começou. Monte a ordem correta e confirme.");
  }

  function toggleItem(item) {
    if (gameOver || feedback) return;

    startTimerIfNeeded();

    setSelectedItems((previousItems) => {
      const alreadySelected = previousItems.some(
        (selectedItem) => selectedItem.id === item.id,
      );

      if (alreadySelected) {
        return previousItems.filter((selectedItem) => selectedItem.id !== item.id);
      }

      if (previousItems.length >= puzzle.items.length) {
        return previousItems;
      }

      return [...previousItems, item];
    });
  }

  function removeLastItem() {
    if (gameOver || feedback) return;
    setSelectedItems((previousItems) => previousItems.slice(0, -1));
  }

  function submitOrder() {
    if (
      gameOver ||
      feedback ||
      selectedItems.length !== puzzle.items.length
    ) {
      return;
    }

    const reactionTime = performance.now() - roundStartRef.current;
    const correct = selectedItems.every(
      (item, index) => item.id === puzzle.solution[index].id,
    );

    setAttempts((previousAttempts) => previousAttempts + 1);
    setReactionTimes((previousTimes) => [...previousTimes, reactionTime]);

    if (correct) {
      const nextScore = scoreRef.current + 1;
      const nextCorrectRounds = correctRoundsRef.current + 1;
      const nextLevel = Math.min(
        1 + Math.floor(nextCorrectRounds / 3),
        MAX_LEVEL,
      );

      setScore(nextScore);
      setCorrectRounds(nextCorrectRounds);
      setFeedback({ type: "success", text: "Ordem correta!" });
      setMessage(
        nextLevel > level
          ? `Muito bem! Você chegou ao nível ${nextLevel}.`
          : "Ordem correta! Prepare-se para a próxima torre.",
      );

      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }

      transitionTimeoutRef.current = setTimeout(() => {
        setPuzzle(createPuzzle(nextLevel));
        setSelectedItems([]);
        setFeedback(null);
        roundStartRef.current = performance.now();
      }, 500);

      return;
    }

    setFeedback({
      type: "error",
      text: "Essa ordem não bate com as pistas. Tente novamente.",
    });
    setMessage("A ordem foi limpa. Revise as pistas e tente de novo.");

    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    transitionTimeoutRef.current = setTimeout(() => {
      setSelectedItems([]);
      setFeedback(null);
      roundStartRef.current = performance.now();
    }, 650);
  }

  useEffect(() => () => {
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
  }, []);

  function resetGame() {
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    submittedRef.current = false;
    setPuzzle(createPuzzle(1));
    setSelectedItems([]);
    setScore(0);
    setAttempts(0);
    setCorrectRounds(0);
    setReactionTimes([]);
    setTimer(TIME_LIMIT);
    setIsTimerOn(false);
    setFeedback(null);
    setMessage(
      "Novo jogo iniciado. Descubra a ordem usando as pistas e monte a torre.",
    );
    roundStartRef.current = performance.now();
  }

  return {
    puzzle,
    selectedItems,
    score,
    attempts,
    timer,
    gameOver,
    level,
    feedback,
    message,
    toggleItem,
    removeLastItem,
    submitOrder,
    resetGame,
  };
}
