# context/

Estado global do app via Context API do React — coisas que muitas telas/componentes precisam saber ao mesmo tempo.

Os dois contextos previstos no roadmap: `AuthContext` (usuário logado, V0.9) e `AccessibilityContext` (preferências de contraste/fonte/animação, V0.17). Não deve virar um "estado global de tudo" — só o que realmente precisa ser compartilhado entre partes distantes da árvore de componentes.
