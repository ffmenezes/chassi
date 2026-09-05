---
name: novo-estilo
description: Use quando o dono quiser um estilo visual novo para o chassi, a partir de um DESIGN.md ou de uma descrição do visual em prosa — "cria um estilo novo", "transforma esse DESIGN.md em tema", "quero uma cara que os cinco estilos de hoje não têm". Produz o par de arquivos que a varredura de `src/styles/estilos/` descobre sozinha, sem tocar em nenhum arquivo existente.
---

# Criar um estilo a partir de um DESIGN.md

Um estilo é dois arquivos: `web/src/styles/estilos/<nome>.css` e
`web/src/styles/estilos/<nome>.ts`. Criar um estilo é escrever esses dois
arquivos, nunca editar outro — nem `index.ts` (que varre a pasta sozinho),
nem um bloco `.astro`, nem outro estilo. É a mesma regra dos sites em
`web/src/sites/`, e existe pelo mesmo motivo: assim ninguém conflita com
ninguém.

## O procedimento

1. **Leia um estilo existente inteiro antes de escrever.** `linho.css` e
   `linho.ts` são o modelo mais simples; passe o olho também em `vidro.css`
   (translúcido, aurora de fundo) e `concreto.css` (borda e sombra duras)
   para ver a amplitude do que cabe aqui. Os cinco estilos, juntos, são a
   referência de quais tokens `--b-*` existem e como cada um se comporta —
   e a referência é o código, não esta skill, para não ficar desatualizada.
   Leia também `web/src/styles/base.css` inteiro: ele declara as três
   camadas e o valor padrão de cada `--b-*`. Seu estilo só precisa
   redefinir o que quiser mudar; o resto cai no padrão sozinho.

2. **As três camadas de `base.css`, e nisso não há meio-termo:**
   `[data-estilo]`, em `@layer estilo`, é forma e tipografia — nenhuma cor.
   `[data-estilo][data-modo]`, em `@layer modo`, é cor — nenhuma medida.
   `[data-site][data-modo]`, camada `site`, é desvio declarado de um site
   e não é assunto de estilo. Misturar cor na camada de forma é o erro
   mais fácil de cometer aqui: funciona no modo claro por acidente e some
   no escuro, porque nada redefine lá.

3. **A regra inegociável: estilo nunca escreve seletor que mira dentro de
   um bloco.** Nada de `.b-card .figura img`. Estilo define token; o bloco
   consome. Um seletor decorativo no PRÓPRIO `[data-estilo="..."]` — o
   `::before` de fundo em `vidro.css`, por exemplo — vale, porque mira o
   contêiner do estilo, não o miolo de um componente. No minuto em que um
   estilo conhece a estrutura interna de um bloco, ele quebra para o
   próximo bloco que nascer.

4. **Os dois modos, claro e escuro, são obrigatórios.** O leitor troca em
   `/exemplo/<estilo>`, e a escolha dele vence — um estilo com um modo só
   sai incompleto.

5. **Contraste AA em cada par de tinta e fundo, nos dois modos.** Confira
   pelo menos `--b-tinta` sobre `--b-fundo`, `--b-corpo` sobre `--b-fundo`
   e `--b-sobre-acento` sobre `--b-acento`. Texto normal precisa de razão
   ≥ 4.5:1; texto grande (24px, ou 18.7px em negrito) e componentes de UI
   aceitam ≥ 3:1. Calcule pela luminância relativa do WCAG ou cole os dois
   hex num verificador de contraste — o número importa, não a ferramenta.

6. **O arquivo `.ts` declara três campos**, como em `linho.ts`: `nome` (o
   que aparece no inventário e no seletor de tema), `acento` (a cor que
   resume o estilo num ponto só) e `origem` — de onde vieram os tokens.
   `origem` existe para o inventário e para a honestidade: escrever "criado
   do zero" quando a paleta veio de outro lugar é exatamente o que essa
   linha existe para impedir.

7. **A verificação final, que é o teste de fogo.** Com os dois arquivos
   escritos: troque `estilo: "..."` em `web/src/sites/exemplo.ts` (ou no
   site que você estiver testando) para o nome do estilo novo, rode
   `cd web && npm run build`, e confira `git status --porcelain`. **Só os
   dois arquivos novos podem aparecer.** A troca de `estilo:` em
   `exemplo.ts` é arreio de teste, não entrega — reverta-a antes de
   terminar. Se sobrar qualquer outro arquivo modificado, o estilo
   escreveu onde não devia (o suspeito de sempre é `index.ts` da pasta de
   estilos editado à mão, ou um bloco `.astro` tocado para o estilo
   funcionar): conserte antes de entregar, porque isso quebraria a
   atualização de todo participante que clonou o chassi.

## O que nunca fazer

- Editar `web/src/styles/estilos/index.ts` — ele varre a pasta, não lista
  estilo por nome.
- Editar um componente `.astro` para o estilo novo funcionar. Bloco sem o
  token que falta é token faltando no bloco, não seletor novo no estilo —
  e está fora do escopo desta skill.
- Entregar um estilo com um modo só, ou com cor na camada `estilo`.
- Commitar o desvio de teste em `web/src/sites/exemplo.ts` (ou onde você
  tiver apontado para testar): ele existe só para passar pelo ponto 7.
