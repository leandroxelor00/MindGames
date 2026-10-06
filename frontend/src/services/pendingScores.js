const CHAVE_PENDENTES = "mindgames_pending_scores";

export function getPendentes() {
  try {
    const lista = JSON.parse(localStorage.getItem(CHAVE_PENDENTES));
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}

export function salvarPendente(result) {
  const novaLista = [...getPendentes(), result];
  localStorage.setItem(CHAVE_PENDENTES, JSON.stringify(novaLista));
}

export function salvarListaPendentes(lista) {
  localStorage.setItem(CHAVE_PENDENTES, JSON.stringify(lista));
}

// Só vale reenviar quando a falha foi de rede/servidor (sem status ou 5xx),
// ou 408/429. Um 4xx significa dado recusado: reenviar não muda o resultado.
export function deveReenviar(error) {
  const status = error?.status;
  if (!status) return true;
  return status >= 500 || status === 408 || status === 429;
}
