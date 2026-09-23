const CHAVE_USER_ID = "mindgames_user_id";
const CHAVE_TOKEN = "mindgames_auth_token";

export function getUserId() {
  const userId = localStorage.getItem(CHAVE_USER_ID);

  if (userId) {
    return userId;
  }

  const novoId = crypto.randomUUID();

  localStorage.setItem(CHAVE_USER_ID, novoId);

  return novoId;
}

export function getCurrentUserId() {
  const token = localStorage.getItem(CHAVE_TOKEN);

  if (!token) {
    return getUserId();
  }

  try {
    const partes = token.split(".");

    if (partes.length !== 3) {
      return getUserId();
    }

    const payload = JSON.parse(atob(partes[1]));

    if (payload.id) {
      return String(payload.id);
    }

    return getUserId();
  } catch {
    return getUserId();
  }
}