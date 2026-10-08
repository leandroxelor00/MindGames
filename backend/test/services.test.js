// Testes dos services mais sujeitos a erro: getStreak, summary, migrateScores e points.
// Roda com banco em memória, sem tocar no mindgames.db.
process.env.DB_PATH = ":memory:";
process.env.JWT_SECRET = "teste";

const test = require("node:test");
const assert = require("node:assert/strict");

const { db } = require("../src/db/connection");
const { runMigrations } = require("../src/db/migrate");

const {
  saveScore,
  getScoresByUserId,
  migrateScores,
  summary,
  getStreak,
} = require("../src/services/scores.service");
const { points } = require("../src/services/points.service");

const UUID = "11111111-1111-4111-8111-111111111111";

test.before(async () => {
  await runMigrations();
});

async function clearScores() {
  await db.execute("DELETE FROM scores");
}

async function insertAt(userId, gameId, playedAt, extra = {}) {
  await db.execute({
    sql: `INSERT INTO scores (userId, gameId, score, accuracy, avgReactionTime, levelReached, playedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [
      userId,
      gameId,
      extra.score ?? 1,
      extra.accuracy ?? 100,
      extra.avgReactionTime ?? 0,
      extra.levelReached ?? 1,
      playedAt,
    ],
  });
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

test("saveScore rejeita valores absurdos e inválidos", async () => {
  const base = {
    userId: UUID,
    gameId: "stroop-test",
    score: 10,
    accuracy: 80,
    avgReactionTime: 500,
    levelReached: 1,
  };
  await assert.rejects(saveScore({ ...base, score: 999999999 }), { status: 400 });
  await assert.rejects(saveScore({ ...base, accuracy: 101 }), { status: 400 });
  await assert.rejects(saveScore({ ...base, score: NaN }), { status: 400 });
  await assert.rejects(saveScore({ ...base, gameId: "nao-existe" }), {
    status: 400,
  });
  await clearScores();
  const saved = await saveScore(base);
  assert.equal(saved.changes, 1);
  // precisa ser serializável (sem BigInt)
  assert.doesNotThrow(() => JSON.stringify(saved));
});

test("migrateScores move só os scores do id antigo", async () => {
  await clearScores();
  await insertAt(UUID, "memory-match", "2026-01-01 12:00:00");
  await insertAt("outro", "memory-match", "2026-01-01 12:00:00");

  assert.equal(await migrateScores(UUID, 7), 1);
  assert.equal((await getScoresByUserId("7")).length, 1);
  assert.equal((await getScoresByUserId(UUID)).length, 0);
  assert.equal((await getScoresByUserId("outro")).length, 1);
});

test("summary usa pontos por categoria (reaction-time não vira 100%)", async () => {
  await clearScores();
  // 325 ms = metade entre 150 e 500 -> 50 pontos
  await insertAt(UUID, "reaction-time", "2026-01-01 12:00:00", {
    accuracy: 100,
    avgReactionTime: 325,
  });
  const result = await summary(UUID);
  assert.equal(result.velocidade, 50);
  assert.equal(result.memoria, 0);
});

test("points limita entre 0 e 100", () => {
  assert.equal(points({ gameId: "reaction-time", avgReactionTime: 10 }), 100);
  assert.equal(points({ gameId: "reaction-time", avgReactionTime: 5000 }), 0);
  assert.throws(() => points({ gameId: "nao-existe" }));
});

test("getStreak: sem partidas é 0", async () => {
  await clearScores();
  assert.equal(await getStreak(UUID), 0);
});

test("getStreak: hoje + ontem = 2; buraco quebra a sequência", async () => {
  await clearScores();
  const now = new Date();
  await insertAt(UUID, "memory-match", sqliteUtc(now));
  await insertAt(UUID, "memory-match", sqliteUtc(new Date(now - 24 * 3600 * 1000)));
  // 3 dias atrás (pula um dia) não entra
  await insertAt(UUID, "memory-match", sqliteUtc(new Date(now - 72 * 3600 * 1000)));
  assert.equal(await getStreak(UUID), 2);
});

test("getStreak: partida às 23h30 de SP conta no dia de SP, não no dia UTC", async () => {
  await clearScores();
  const now = new Date();
  // hoje (SP) às 02:30 UTC = ontem (SP) às 23:30
  const lateNight = new Date(`${spDay(now)}T02:30:00Z`);
  assert.notEqual(spDay(lateNight), spDay(now));

  await insertAt(UUID, "memory-match", sqliteUtc(now));
  await insertAt(UUID, "memory-match", sqliteUtc(lateNight));
  assert.equal(await getStreak(UUID), 2);
});
