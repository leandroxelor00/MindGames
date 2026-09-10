# hooks/

Custom hooks compartilhados entre múltiplas partes do app — não a lógica interna de um jogo específico (essa fica dentro de `games/<jogo>/use<Jogo>.js`).

Exemplo principal: `useAdaptiveDifficulty.js` (V0.14) e `useAuth.js` (V0.9), que são reaproveitados por vários jogos/páginas ao mesmo tempo.
