# controllers/

Recebe a requisição já roteada, extrai o que precisa dela (params, body, usuário autenticado) e chama o `service` correspondente — depois formata a resposta (status code + JSON) pro cliente.

Não deve conter regra de negócio nem query de banco — isso é papel de `services/` e `models/`. O controller é só a "ponte" entre HTTP e a lógica da aplicação.
