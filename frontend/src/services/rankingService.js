import { apiFetch } from "./api";

export async function getGlobalRanking(limit = 10) {
  const data = await apiFetch(`/ranking/global?limit=${limit}`);
  return data.result;
}

export async function getGameRanking(gameId, limit = 10) {
  const data = await apiFetch(`/ranking/${gameId}?limit=${limit}`);
  return data.result;
}
