# DESIGN

> **Este arquivo é prosa, não configuração.** O que é máquina — estilo,
> modo, os até 6 desvios de token permitidos — mora em
> `web/src/sites/<slug>.ts`, que é o arquivo que **quebra a build** se
> estiver errado. Duas fontes da verdade para o mesmo fato é o que se evita:
> aqui vai o **porquê**, lá vai a **máquina**.
> **O que mora aqui:** por que este estilo, qual a postura visual, o que o
> site conscientemente não faz.
> **O que NÃO mora aqui:** o nome do estilo, o modo (claro/escuro) e os
> valores dos tokens desviados — tudo isso é `web/src/sites/<slug>.ts`.

## As perguntas que este arquivo responde

1. Que estilo visual (dos disponíveis em `web/src/styles/estilos/`) combina
   com este nicho, e por quê?
2. Que postura esse estilo transmite (sério, acessível, técnico, caseiro)?
3. O que este site conscientemente **não** faz visualmente (ex.: não usa cor
   de alerta fora de aviso real, não usa foto de banco de imagens sorrindo)?
4. Se você precisar de um token que o estilo não tem, isso é um desvio
   (`web/src/sites/<slug>.ts`, teto de 6) ou sinal de que o estilo errado
   foi escolhido?
5. Que bloco do catálogo o site declara e qual ele deixa fora de
   propósito (quiz, slides, carrossel)? Bloco fora da lista de
   `web/src/sites/<slug>.ts` não nasce na página, mesmo que a peça peça.
6. Como a página deve se comportar sem JavaScript e no celular: o que precisa
   estar visível sem hover nem clique? (É restrição do chassi, não
   preferência; a pergunta é o que o site acrescenta a ela.)

<!-- Responda abaixo. Apague as perguntas quando as respostas estiverem de pé. -->
