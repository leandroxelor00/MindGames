# services/

Onde mora a regra de negócio de verdade: cálculo de médias/resumo, lógica de streak, migração de dados anônimos pra conta, validação de senha, etc.

Um controller nunca deve calcular nada sozinho — sempre delega pra uma função daqui. Isso deixa a lógica testável e reaproveitável fora do contexto de uma requisição HTTP específica.
