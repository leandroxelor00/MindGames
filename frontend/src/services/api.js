export const CHAVE_TOKEN = "mindgames_auth_token";

const BASE_URL = "http://localhost:3001/api";

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem(CHAVE_TOKEN);

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });
  if (!response.ok) {
    const error = new Error(`Erro na API: ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}
