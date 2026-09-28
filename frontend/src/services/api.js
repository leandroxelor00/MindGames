export const CHAVE_TOKEN = "mindgames_auth_token";
export const CHAVE_USER = "mindgames_auth_user";

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
    let errorMessage = `Erro na API: ${response.status}`;
    const errorText = await response.text();

    try {
      const errorData = JSON.parse(errorText);
      if (errorData && (errorData.error || errorData.message)) {
        errorMessage = errorData.error || errorData.message;
      }
    } catch {
      if (errorText) {
        errorMessage = errorText;
      }
    }
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }
  return response.json();
}