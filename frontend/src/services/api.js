const BASE_URL = "http://localhost:3001/api";

export async function apiFetch(path, options = {}) {
  // Concatena a URL base com o caminho passado (ex: "http://localhost:3001/api" + "/usuarios").
  const response = await fetch(`${BASE_URL}${path}`, {
    // Espalha (...options) todas as configurações extras que você passar para a função (ex: method: 'POST').
    ...options,
    headers: {
      // Define o padrão para enviar e receber dados no formato JSON.
      "Content-Type": "application/json",
      // Espalha outros cabeçalhos que você possa ter passado dentro de 'options', permitindo sobrescrever o Content-Type ou adicionar novos (como tokens de autorização).
      ...options.headers,
    },
  });
  // dentro de api.js, na apiFetch:
  if (!response.ok) {
    const error = new Error(`Erro na API: ${response.status}`);
    error.status = response.status;
    throw error;
  }
  // Se a requisição foi um sucesso, converte a resposta para um objeto JavaScript (JSON) e retorna esse resultado para quem chamou a função.
  return response.json();
}
