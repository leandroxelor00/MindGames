import { apiFetch } from "./api";
import { salvarPendente } from "./pendingScores";

export async function postScore(result) {
  try {
    return await apiFetch("/scores", {
      method: "POST",
      body: JSON.stringify(result),
    });
  } catch (error) {
    salvarPendente(result);
    throw error;
  }
}

export async function getHistory() {
  try {
    const resultado = await apiFetch("/scores/me");
    return resultado.result;
  } catch (error) {
    if (error.status === 404) {
      return [];
    }
    throw error;
  }
}

export async function migrateScores(oldUserId) {
  const resultado = await apiFetch("/scores/migrate", {
    method: "POST",
    body: JSON.stringify({ oldUserId }),
  });

  return resultado;
}