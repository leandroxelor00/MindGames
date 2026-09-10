# services/

Funções que falam com o mundo de fora do componente: chamadas HTTP para o backend (`api.js`, `scoreService.js`, `authService.js`).

Um jogo ou página nunca deve chamar `fetch` diretamente — sempre passa por uma função daqui. Isso mantém a lógica de rede num lugar só, fácil de trocar ou depurar.
