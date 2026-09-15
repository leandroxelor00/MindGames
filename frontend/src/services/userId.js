// Define uma constante com o nome da "chave" que será usada para salvar e buscar o ID do usuário no armazenamento do navegador.
const CHAVE_USER_ID = "mindgames_user_id";

export function getUserId() {
  // Tenta buscar um ID de usuário que já esteja salvo no localStorage (armazenamento local do navegador).
  const userId = localStorage.getItem(CHAVE_USER_ID);
  if (userId) {
    return userId;
  }
  // Se é um usuario novo gera um novo ID único (UUID) no formato padrão usando a API nativa 'crypto' do navegador.
  const novoId = crypto.randomUUID();
  // Salva esse novo ID no localStorage usando a chave definida lá em cima.
  localStorage.setItem(CHAVE_USER_ID, novoId);
  return novoId;
}
