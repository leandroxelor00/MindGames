import { apiFetch, CHAVE_TOKEN, CHAVE_USER } from "./api";

export async function register(email, plainPassword) {
  const data = await apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, plainPassword }),
  });

  localStorage.setItem(CHAVE_TOKEN, data.token);
  localStorage.setItem(CHAVE_USER, JSON.stringify(data.result));

  return {
    user: data.result,
    token: data.token,
  };
}

export async function login(email, plainPassword) {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, plainPassword }),
  });

  localStorage.setItem(CHAVE_TOKEN, data.token);
  localStorage.setItem(CHAVE_USER, JSON.stringify(data.result));

  return {
    user: data.result,
    token: data.token,
  };
}

export function logout() {
  localStorage.removeItem(CHAVE_TOKEN);
  localStorage.removeItem(CHAVE_USER);
}