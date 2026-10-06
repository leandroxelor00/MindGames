// Testes dos services mais sujeitos a erro: getStreak, summary, migrateScores e points.
// Roda com banco em memória, sem tocar no mindgames.db.
process.env.DB_PATH = ":memory:";
process.env.JWT_SECRET = "teste";

const test = require("node:test");
const assert = require("node:assert/strict");

const { db } = require("../src/db/connection");
require("../src/db/migrations/001_create_scores");
require("../src/db/migrations/002_create_users");
require("../src/db/migrations/003_add_username_to_users");

const {
  saveScore,
  getScoresByUserId,
  migrateScores,
  summary,
  getStreak,
} = require("../src/services/scores.service");
const { points } = require("../src/services/points.service");

const UUID = "11111111-1111-4111-8111-111111111111";

function clearScores() {
  db.exec("DELETE FROM scores");
}

function insertAt(userId, gameId, playedAt, extra = {}) {
  db.prepare(
    `INSERT INTO scores (userId, gameId, score, accuracy, avgReactionTime, levelReached, playedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    userId,
    gameId,
    extra.score ?? 1,
    extra.accuracy ?? 100,
    extra.avgReactionTime ?? 0,
    extra.levelReached ?? 1,
    playedAt,
  );
}

// "YYYY-MM-DD HH:MM:SS" em UTC, como o SQLite grava
function sqliteUtc(date) {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

function spDay(date) {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Sao_Paulo",
  }).format(date);
}

test("saveScore rejeita valores absurdos e inválidos", () => {
  const base = {
    userId: UUID,
    gameId: "stroop-test",
    score: 10,
    accuracy: 80,
    avgReactionTime: 500,
    levelReached: 1,
  };
  assert.throws(() => saveScore({ ...base, score: 999999999 }), { status: 400 });
  assert.throws(() => saveScore({ ...base, accuracy: 101 }), { status: 400 });
  assert.throws(() => saveScore({ ...base, score: NaN }), { status: 400 });
  assert.throws(() => saveScore({ ...base, gameId: "nao-existe" }), {
    status: 400,
  });
  clearScores();
  assert.ok(saveScore(base));
});

test("migrateScores move só os scores do id antigo", () => {
  clearScores();
  insertAt(UUID, "memory-match", "2026-01-01 12:00:00");
  insertAt("outro", "memory-match", "2026-01-01 12:00:00");

  assert.equal(migrateScores(UUID, 7), 1);
  assert.equal(getScoresByUserId("7").length, 1);
  assert.equal(getScoresByUserId(UUID).length, 0);
  assert.equal(getScoresByUserId("outro").length, 1);
});

test("summary usa pontos por categoria (reaction-time não vira 100%)", () => {
  clearScores();
  // 325 ms = metade entre 150 e 500 -> 50 pontos
  insertAt(UUID, "reaction-time", "2026-01-01 12:00:00", {
    accuracy: 100,
    avgReactionTime: 325,
  });
  const result = summary(UUID);
  assert.equal(result.velocidade, 50);
  assert.equal(result.memoria, 0);
});

test("points limita entre 0 e 100", () => {
  assert.equal(points({ gameId: "reaction-time", avgReactionTime: 10 }), 100);
  assert.equal(points({ gameId: "reaction-time", avgReactionTime: 5000 }), 0);
  assert.throws(() => points({ gameId: "nao-existe" }));
});

test("getStreak: sem partidas é 0", () => {
  clearScores();
  assert.equal(getStreak(UUID), 0);
});

test("getStreak: hoje + ontem = 2; buraco quebra a sequência", () => {
  clearScores();
  const now = new Date();
  insertAt(UUID, "memory-match", sqliteUtc(now));
  insertAt(UUID, "memory-match", sqliteUtc(new Date(now - 24 * 3600 * 1000)));
  // 3 dias atrás (pula um dia) não entra
  insertAt(UUID, "memory-match", sqliteUtc(new Date(now - 72 * 3600 * 1000)));
  assert.equal(getStreak(UUID), 2);
});

test("getStreak: partida às 23h30 de SP conta no dia de SP, não no dia UTC", () => {
  clearScores();
  const now = new Date();
  // hoje (SP) às 02:30 UTC = ontem (SP) às 23:30
  const lateNight = new Date(`${spDay(now)}T02:30:00Z`);
  assert.notEqual(spDay(lateNight), spDay(now));

  insertAt(UUID, "memory-match", sqliteUtc(now));
  insertAt(UUID, "memory-match", sqliteUtc(lateNight));
  assert.equal(getStreak(UUID), 2);
});
