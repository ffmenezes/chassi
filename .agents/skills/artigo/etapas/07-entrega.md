# Etapa 7 — Entrega

Caminhos: `sites/`, `web/` e `scripts/` partem da raiz do checkout do
chassi; `referencias/` parte de `.agents/skills/artigo/`. `base/`,
`estado/`, `pautas/`, `pesquisa/` e `posts/` abreviados partem de
`sites/<slug>/`. Rode scripts da raiz, com o caminho completo da peça.
Site novo exige o par de cópias descrito em `sites/_modelo/README.md`.

Confere que a peça revisada cabe no que a build cobra, atualiza o
`CLUSTER.md`, e entrega ao dono a lista curta do que só ele pode fazer.
Não escreve prosa. Não corrige texto: se achar defeito de texto aqui,
devolve à etapa 6.

## Leia só isto

- `sites/<slug>/posts/<peça>/post.md`.
- `sites/<slug>/posts/<peça>/revisao.md` — só o último veredito, que
  precisa ser `aprovado`.
- `referencias/blocos.md` — a seção "O que a build cobra".
- `web/src/sites/<slug>.ts` — o campo `blocos` e o `dominio`.
- `sites/<slug>/base/AUTOR.md` — os campos que `web/src/autor.ts` exige.
- `sites/<slug>/estado/CLUSTER.md`.
- `sites/<slug>/pesquisa/<peça>/dossie.md` — dado próprio e `vence primeiro`.
- `sites/<slug>/base/DECLARACOES.md` e `base/MONETIZACAO.md` — declarações
  e contexto para a lista de links; não decidem a coluna do dono.

## Escreva só isto

- A linha da peça no `CLUSTER.md`: status `pronto` e, na prosa
  append-only, a data e o `vence primeiro` do dossiê (é o gatilho da
  manutenção). `publicado` é a página no ar; quem marca é o dono, quando
  ela existir, e só a partir daí outras peças podem linkar para esta.
- `posts/<peça>/links.md`, gerado por `scripts/listar-links post.md >
  links.md`: todo link do corpo, com capítulo, âncora, URL, tipo e a
  coluna "decisão do dono" vazia. É o checklist que o dono preenche
  depois do rascunho: manter, trocar por afiliado, trocar a fonte,
  remover. A peça não vai a `publicado` com linha sem decisão.
  Se `links.md` já existe, não sobrescreva decisões: gere uma proposta
  temporária, compare por URL e âncora, preserve decisões dos links iguais
  e deixe vazia só a decisão de link novo ou alterado.
- A lista de pendências, no fim de `revisao.md`, sob `## Entrega`.

```markdown
## Entrega — 2026-09-12

Blocos usados: 1, 2, 3 (4 H2), 4, 9, 10, 22. Todos em `blocos` do site.
Card social: título com 58 caracteres; domínio `exemplo.com.br` (só host).
Autor: `base/AUTOR.md` completo, nome com sobrenome.

Pendências para o dono:
- [ ] Encanamento `post.md → blocos` ainda não existe: a peça está pronta
      em `posts/<peça>/post.md`; a página nasce quando o parser chegar
      (ou à mão, em `web/src/mock/`, se for vitrine).
- [ ] Figura C2: `pesquisa/<peça>/print-painel.png` precisa entrar no
      acervo (lugar ainda não decidido; ver AGENTS.md).
- [ ] `[LINK PENDENTE: inverter-ou-convencional]`: entra quando aquele slug
      for `publicado`.
- [ ] `links.md`: 5 links aguardando decisão (2 de loja, candidatos a
      afiliado de `base/MONETIZACAO.md`; 1 fonte oficial; 2 terceiros).
- [ ] Marcar `publicado` no `CLUSTER.md` quando a página estiver no ar e
      `links.md` estiver decidido.

Manutenção: reabrir em ~2027-06 (D1, revisão tarifária), ou antes se a
tarifa mudar.
```

## O que conferir, na ordem

1. **Veredito.** Última rodada de `revisao.md` é `aprovado`. Outra coisa:
   pare.
2. **Blocos.** Todo `:::bloco` do `post.md` está na lista `blocos` de
   `web/src/sites/<slug>.ts`. Bloco fora dela não existe na página; ou o
   dono acrescenta lá, ou o bloco vira prosa (devolve à etapa 5).
3. **Travas da build**, por bloco presente (a lista está em
   `referencias/blocos.md`): figura com alt, legenda, fonte e data; alt
   diferente da legenda; código com rótulo e sem `$ ` no início de linha;
   aviso `atencao` com fonte; gráfico com título, fonte e uma coluna por
   série, sem coluna a mais nem a menos; quatro ou mais H2; título do card social não
   vazio; `atualizado` em `AAAA-MM-DD`.
4. **Autor.** `base/AUTOR.md` sem `[DEFINIR]`, nome com sobrenome, não
   coletivo, `sameAs` declarado. Sem isso o bloco 22 não nasce e a peça
   não é entregue: pendência para o dono, status fica `revisado`.
5. **Declarações.** A seção "Como esta peça foi feita" existe e tem o que
   `base/DECLARACOES.md` exige mais o dado próprio com método e data.
6. **Links pendentes.** Liste cada `[LINK PENDENTE]` com o slug. Não
   remova: quando o slug publicar, a manutenção liga.
7. **Datas.** `publicado` e `atualizado` iguais e com a data da entrega.
   Nunca datar para trás nem para frente.
7b. **Sobras do exemplo no site.** `web/src/sites/<slug>.ts` ainda com
   `responsavel.nome` "Seu Nome", ícone ou e-mail herdados de
   `exemplo.ts`: não travam a peça, mas vão para a página; listar como
   pendência do dono.
8. **Links para o dono.** Gere `links.md` e leia a tabela uma vez: link
   de loja ou de produto é onde o programa de afiliado de
   `base/MONETIZACAO.md` costuma caber; link de fonte oficial não se
   troca; link de terceiro que só localizou a fonte (blog, portal) é
   candidato a remover. Não decida por ele: a coluna fica vazia.
9. **CLUSTER.** Status `pronto`, prosa com data e `vence primeiro`.

## Quando o dono devolve o `links.md` decidido

É a única volta prevista depois da entrega, e é cirúrgica:

1. **trocar por afiliado**: a URL muda, a âncora não; a declaração que
   `base/DECLARACOES.md` manda entra na seção "Como esta peça foi feita"
   (uma frase: quais links são de afiliado e que o preço para o leitor não
   muda), se ainda não estava. Sem declaração, o link não troca.
2. **trocar a fonte**: a URL nova precisa de bloco D no dossiê (append), e
   a frase que ela sustenta é conferida contra a fonte nova; número que
   mudou volta à etapa 6.
3. **remover**: a frase perde o link, não a afirmação. Se a afirmação só
   ficava de pé com aquele link, ela vira `[SEM DADO]` no dossiê e sai do
   texto (etapa 6).
4. Rode `scripts/higiene-texto` e `scripts/medir-texto` de novo, anote no
   diário como entrada `links`, e só então o dono marca `publicado`.

## Regras

1. **Entrega não escreve texto.** Defeito de texto volta à etapa 6 com a
   linha e o trecho.
2. **Pendência é do dono, não da peça.** Peça com todas as travas ok e
   uma pendência de acervo é peça entregue com pendência listada; não
   fica presa esperando.
3. **A data de `atualizado` só muda com mudança de fato.** Reentregar a
   mesma peça por correção de vírgula não move a data.

## E no diário

Acrescente a entrada da etapa 7 em `posts/<peça>/diario.md` (gabarito
no fim do SKILL.md): feito, decidido (com a alternativa que perdeu),
descartado, adiado, travou em, tempo. Registre as pendências que ficaram com o dono e a data de manutenção.

Gabarito desta entrada (acrescente ao diário; não substitua entradas):

```markdown
## <data> · etapa 7 · entrega
**feito:** <arquivos e resultado>
**decidido:** <escolha, critério e alternativa que perdeu>
**descartado:** <item e motivo, ou nada>
**adiado:** <item e destino/condição, ou nada>
**travou em:** <obstáculo e encaminhamento, ou nada>
**tempo:** <duração medida, estimativa declarada ou não medido>
```

## Checagem antes de fechar

- [ ] Entrada desta etapa no `diario.md`, com os seis campos.
- [ ] Veredito `aprovado` na última rodada.
- [ ] Todos os blocos usados estão em `blocos` do site.
- [ ] Todas as travas da build conferidas por bloco presente.
- [ ] `AUTOR.md` válido, ou pendência listada e status mantido em
      `revisado`.
- [ ] Seção `## Entrega` escrita em `revisao.md` com pendências e data de
      manutenção.
- [ ] Linha do `CLUSTER.md` em `pronto` (ou `revisado`, com o motivo).

## Se travar

- O site não declara o bloco que a peça usa: a etapa 3 devia ter
  acrescentado; acrescente agora em `web/src/sites/<slug>.ts`, rode
  `npm run check` e anote no diário. Só se quem executa não é o dono do
  site: status `revisado`, pendência listada, pare.
- `AUTOR.md` em branco: mesma coisa. Byline meia-boca é pior que nenhuma,
  e a build concorda.
