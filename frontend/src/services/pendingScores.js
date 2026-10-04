const CHAVE_PENDENTES = "mindgames_pending_scores";

export function salvarPendente(result) {
  const listaAtual = JSON.parse(localStorage.getItem(CHAVE_PENDENTES)) || [];
  const novaLista = [...listaAtual, result];
  localStorage.setItem(CHAVE_PENDENTES, JSON.stringify(novaLista));
}

export function getPendentes() {
  return JSON.parse(localStorage.getItem(CHAVE_PENDENTES)) || [];
}

export function salvarListaPendentes(lista) {
  localStorage.setItem(CHAVE_PENDENTES, JSON.stringify(lista));
}