# games/stroop-test/

Stroop Test — V0.3 do roadmap. Exibe uma palavra de cor com a fonte em cor diferente; jogador clica na cor da fonte (não na palavra), medindo tempo de reação.

Contém `StroopTest.jsx` e `useStroopTest.js`, seguindo o mesmo padrão dos outros jogos.

---

# Anotacoes para o jogo

---

### quais estados usarei?

- score, tries, timer, reaction time (nao sei como fazer mas verei), gameover, por enquanto só


### quais componentes existem?

- 

### quais dados o jogo precisa ter?

- colors, words

### o que acontece quando o jogador clica?

- aparece a palavra com o nome de uma cor e a cor de fato da palavar com outra cor, se apertar na cor correta da palavra, ganha um ponto,
- o clique ativa o botao que faz a comparaçao da cor em questao com a cor clicada, o score atualiza

### quais eventos existem?

- conferir acerto e atualizar score,
- evento do timer,
- click do botao,
- o jogo terminando ao timer zerar