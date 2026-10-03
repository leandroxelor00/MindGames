import { apiFetch, CHAVE_TOKEN } from "./api";
import { salvarPendente } from "./pendingScores";
import { getCurrentUserId, getUserId } from "./userId";

export async function postScore(result) {
  const userId = getCurrentUserId();

  const resultadoComUsuario = {
    ...result,
    userId,
  };

  try {
    return await apiFetch("/scores", {
      method: "POST",
      body: JSON.stringify(resultadoComUsuario),
    });
  } catch (error) {
    salvarPendente(resultadoComUsuario);
    throw error;
  }
}

export async function getHistory() {
  const token = localStorage.getItem(CHAVE_TOKEN);

  try {
    if (token) {
      const resultado = await apiFetch("/scores/me");

      return resultado.result;
    }

    const userId = getUserId();

    const resultado = await apiFetch(`/scores/${userId}`);

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

export async function getSummary() {
  const token = localStorage.getItem(CHAVE_TOKEN);

  try {
    if (token) {
      const resultado = await apiFetch("/scores/me/summary");
      return resultado.result;
    }

    const userId = getUserId();
    const resultado = await apiFetch(`/scores/${userId}/summary`);
    return resultado.result;
  } catch (error) {
    if (error.status === 404) {
      return { memoria: 0, atencao: 0, velocidade: 0, logica: 0 };
    }
    throw error;
  }
}

export async function getStreak() {
  const token = localStorage.getItem(CHAVE_TOKEN);

  if (token) {
    const resultado = await apiFetch("/scores/me/streak");
    return resultado.result;
  }

  const userId = getUserId();
  const resultado = await apiFetch(`/scores/${userId}/streak`);
  return resultado.result;
}

export async function getDailyChallenge() {
  const resultado = await apiFetch("/daily-challenge");
  return resultado.result;
}
