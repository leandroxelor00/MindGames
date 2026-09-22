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

export async function getHistory(userId) {
  try {
    const resultado = await apiFetch(`/scores/${userId}`);
    return resultado.result;
  } catch (error) {
    if (error.status === 404) {
      return [];
    }
    throw error;
  }
}

export async function migrateScores(userIdAnonimo, userIdConta) {
  const resultado = await apiFetch("/scores/migrate", {
    method: "POST",
    body: JSON.stringify({ userIdAnonimo, userIdConta }),
  });
  return resultado;
}
