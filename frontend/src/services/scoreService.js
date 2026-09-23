import { apiFetch } from "./api";
import { salvarPendente } from "./pendingScores";
import { getCurrentUserId, getUserId } from "./userId";

export async function postScore(result) {
  const userId = getCurrentUserId();

  console.log("ID usado para salvar score:", userId);
  console.log("Resultado enviado:", {
    ...result,
    userId,
  });

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
  const token = localStorage.getItem("mindgames_auth_token");

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