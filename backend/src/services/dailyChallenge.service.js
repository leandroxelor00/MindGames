const crypto = require("crypto");

const availableGames = [
  "memory-match",
  "stroop-test",
  "number-challenge",
  "visual-memory",
  "food-memory",
  "reaction-time",
];

const date = new Date();

function createDateHash(date, i) {
  const data = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Sao_Paulo",
  }).format(date);

  const dateFormat = data + `:${i}`;

  const hash = crypto.createHash("sha256");
  hash.update(dateFormat);
  const digest = hash.digest("hex");

  return digest;
}

function getDailyChallenge() {
  const indexArr = new Set();
  let i = 1;
  while (indexArr.size < 3) {
    const hash = createDateHash(date, i);
    const number = BigInt("0x" + hash);
    const index = Number(number % BigInt(availableGames.length));
    indexArr.add(index);
    i += 1;
  }

  return indexToGames(indexArr);
}

function indexToGames(arr) {
  const newArr = availableGames.filter((_, i) => arr.has(i));
  return newArr;
}

module.exports = { getDailyChallenge };
