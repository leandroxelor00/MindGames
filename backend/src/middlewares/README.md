# middlewares/

Funções que rodam antes da rota final ser processada — ex.: `auth.middleware.js` (V0.9, valida o JWT antes de deixar passar) e `errorHandler.js` (V0.18, captura erros de qualquer rota num lugar só).

Middleware não deve conter lógica de negócio específica de uma feature; é sempre algo "transversal", que se aplica a várias rotas.
