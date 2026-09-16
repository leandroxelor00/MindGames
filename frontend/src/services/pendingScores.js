// Define a chave que será usada para salvar e recuperar a lista de pontuações pendentes no armazenamento do navegador (localStorage).
const CHAVE_PENDENTES = "mindgames_pending_scores";

// Exporta a função responsável por adicionar um novo resultado à lista de pendentes.
export function salvarPendente(result) {
  // Busca no localStorage os dados salvos com a chave definida acima.
  // Como o localStorage só guarda textos (strings), usamos JSON.parse() para transformar esse texto de volta em um array (lista) do JavaScript.
  // O '|| []' garante que, se não houver nada salvo (retornar null), ele crie uma lista vazia.

  const listaAtual = JSON.parse(localStorage.getItem(CHAVE_PENDENTES)) || [];
  // Ele pega todos os itens que já estavam na 'listaAtual' e adiciona o novo 'result' no final dessa nova lista.

  const novaLista = [...listaAtual, result];
  // O JSON.stringify() é usado para converter o array JavaScript de volta para formato de texto, que é o formato exigido pelo localStorage.
  localStorage.setItem(CHAVE_PENDENTES, JSON.stringify(novaLista));
}

export function getPendentes() {
  // Faz o mesmo processo: busca o texto no localStorage, converte para um array JS com JSON.parse(), ou retorna um array vazio se não houver nenhum dado salvo.
  return JSON.parse(localStorage.getItem(CHAVE_PENDENTES)) || [];
}
