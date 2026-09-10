# components/Timer/

Componente de cronômetro/contador de tempo reutilizável entre os jogos (crescente ou decrescente, dependendo de como for chamado).

Não guarda a regra de "o que acontece quando o tempo acaba" — isso é responsabilidade do hook do jogo que o está usando; o Timer só exibe o tempo e avisa quando chega a zero (ou emite o tempo decorrido).
