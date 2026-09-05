# AUTOR

> **O que mora aqui:** quem assina o texto, com que autoridade, o que essa
> pessoa declara sobre si.
> **O que NÃO mora aqui:** o que precisa estar declarado ao leitor sobre o
> conteúdo em si — link de afiliado, patrocínio (DECLARACOES.md).

> **Este é o único arquivo de `base/` com consequência em código.** O bloco 22
> — byline no topo e card no fim do artigo — lê a ficha do fim deste arquivo,
> e `web/src/autor.ts` julga a forma dela: enquanto faltar campo, **o bloco
> não nasce**. Byline meia-boca é pior que byline nenhum, porque a página
> passa a afirmar autoria que ela não tem. As perguntas vêm primeiro; a ficha
> é o resumo delas, nunca o substituto.

## As perguntas que este arquivo responde

1. Quem assina os artigos — uma pessoa real, um pseudônimo declarado, ou uma
   "equipe"?
2. Que autoridade essa assinatura carrega de fato (formação, anos de
   experiência, o que ela já testou)?
3. O que essa pessoa declara sobre conflito de interesse (ex.: já foi
   funcionária de uma marca do nicho)?
4. Se um leitor cético procurar essa assinatura, o que ele precisa encontrar
   para confiar?

<!-- Responda abaixo. Apague as perguntas quando as respostas estiverem de pé. -->

## A ficha

Os nomes dos campos são os de `web/src/autor.ts`, de propósito: são os mesmos
que o bloco 22 lê e os mesmos que saem no `Person` do JSON-LD. Troque cada
`[DEFINIR]` pela resposta — enquanto o texto `[DEFINIR]` estiver aí, o campo
conta como não respondido, e é isso que o código procura.

- **nome:** `[DEFINIR]` — nome e sobrenome reais.
- **slug:** `[DEFINIR]` — sai do nome. Vira `/autores/{slug}` e o `@id` do
  nó `Person`.
- **jobTitle:** `[DEFINIR]` — o que a pessoa faz, de verdade, dito na
  relação com o nicho. Cabe numa linha ao lado do nome.
- **description:** `[DEFINIR]` — duas ou três frases de credencial ligada ao
  nicho. É o que o leitor cético lê antes de decidir se acredita no artigo.
- **image:** `[DEFINIR]` — caminho de uma foto real. Avatar gerado, banco de
  imagem e logo não valem; o código só confere que existe caminho, quem
  reprova o resto é o olho de quem revisa.
- **sameAs:** `[DEFINIR]` — perfis públicos verificáveis, um por linha.
  **Lista vazia é uma resposta** (escreva `nenhum`); campo ausente é
  pendência, e pendência trava o bloco.
- **perfil:** *(opcional)* a URL da página do autor, só quando ela estiver no
  ar. Sem ela, o nome sai como texto — link para 404 é pior que ausência de
  link.

### O que reprova a ficha

O julgamento inteiro está em `web/src/autor.ts`; ele devolve uma pendência
escrita por vez, na ordem dos campos.

- campo obrigatório vazio, ou ainda com `[DEFINIR]`;
- **nome sem sobrenome** — byline é pessoa inteira;
- **nome que é coletivo** ("Equipe", "Redação", "Time", "Staff") — byline é
  quem escreveu, não a casa. Se o site não tem uma pessoa para assinar, o
  problema não é este arquivo;
- **`sameAs` ausente** — a declaração é obrigatória; o conteúdo dela, não.
