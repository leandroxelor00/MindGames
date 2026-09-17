import { apiFetch, CHAVE_TOKEN } from "./api";

export async function register(email, password) {
  const data = await apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  localStorage.setItem(CHAVE_TOKEN, data.token);

  return {
    user: data.user,
    token: data.token,
  };
}

export async function login(email, password) {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  localStorage.setItem(CHAVE_TOKEN, data.token);

  return {
    user: data.user,
    token: data.token,
  };
}

export function logout() {
  localStorage.removeItem(CHAVE_TOKEN);
}