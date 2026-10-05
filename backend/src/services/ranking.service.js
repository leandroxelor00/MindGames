const { points } = require("./points.service");
const {
  MIN_RANKING_MATCHES,
  TOP_RANKING_SCORES,
} = require("../config/gamesConfig");
const { selectScoresWithUsername } = require("../models/score.model");

function round1(n) {
  return Math.round(n * 10) / 10;
}

function toPointRows(rows) {
  const result = [];
  for (const row of rows) {
    try {
      result.push({
        userId: row.userId,
        username: row.username,
        gameId: row.gameId,
        pontos: points(row),
      });
    } catch {}
  }
  return result;
}

function groupByUser(pointRows) {
  const map = new Map();
  for (const row of pointRows) {
    if (!map.has(row.userId))
      map.set(row.userId, { username: row.username, rows: [] });
    map.get(row.userId).rows.push(row);
  }
  return map;
}

function average(numbers) {
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}

function buildGameEntries(pointRows, gameId) {
  const entries = [];
  const byUser = groupByUser(pointRows.filter((r) => r.gameId === gameId));

  for (const [userId, { username, rows }] of byUser) {
    if (rows.length < MIN_RANKING_MATCHES) continue;

    const best = rows
      .map((r) => r.pontos)
      .sort((a, b) => b - a)
      .slice(0, TOP_RANKING_SCORES);

    entries.push({
      userId,
      username,
      pontos: round1(average(best)),
      partidas: rows.length,
    });
  }
  return entries;
}

function buildGlobalEntries(pointRows) {
  const entries = [];
  const byUser = groupByUser(pointRows);

  for (const [userId, { username, rows }] of byUser) {
    const bestByGame = new Map();
    for (const r of rows) {
      if (!bestByGame.has(r.gameId) || r.pontos > bestByGame.get(r.gameId)) {
        bestByGame.set(r.gameId, r.pontos);
      }
    }

    const total = [...bestByGame.values()].reduce((sum, p) => sum + p, 0);

    entries.push({
      userId,
      username,
      pontos: round1(total),
      partidas: rows.length,
    });
  }
  return entries;
}

function sortAndNumber(entries) {
  return entries
    .sort(
      (a, b) =>
        b.pontos - a.pontos ||
        a.partidas - b.partidas ||
        a.username.localeCompare(b.username),
    )
    .map((e, i) => ({ ...e, posicao: i + 1 }));
}

function buildResponse(base, numbered, limit, myUserId) {
  const clean = (e) => ({
    posicao: e.posicao,
    username: e.username,
    pontos: e.pontos,
    partidas: e.partidas,
  });
  const mine = numbered.find((e) => e.userId === String(myUserId));

  return {
    ...base,
    ranking: numbered.slice(0, limit).map(clean),
    minhaPosicao: mine ? clean(mine) : null,
  };
}

function getGlobalRanking(limit = 10, myUserId = null) {
  const pointRows = toPointRows(selectScoresWithUsername());
  const entries = buildGlobalEntries(pointRows);
  const numbered = sortAndNumber(entries);
  return buildResponse({ tipo: "global" }, numbered, limit, myUserId);
}

function getGameRanking(gameId, limit = 10, myUserId = null) {
  const pointRows = toPointRows(selectScoresWithUsername());
  const entries = buildGameEntries(pointRows, gameId);
  const numbered = sortAndNumber(entries);
  return buildResponse({ tipo: "jogo", gameId }, numbered, limit, myUserId);
}

module.exports = { getGlobalRanking, getGameRanking };
