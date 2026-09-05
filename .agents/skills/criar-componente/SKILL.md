---
name: criar-componente
description: Use quando o dono quiser um bloco novo no catálogo do chassi ou um componente de chrome novo — "cria um bloco para X", "falta um bloco de Y no catálogo", "quero um componente novo para o artigo". Conduz do catálogo ao componente, aos tokens que faltarem, ao espécime na bancada e ao mock, e reúne os erros reais que já quebraram bloco aqui para não repeti-los.
---

# Criar um bloco novo

Um bloco é uma peça de artigo com regra própria, e a regra nasce em
`.claude/skills/artigo/referencias/arquitetura-pagina.md` — a autoridade —
antes de virar código. `web/src/catalogo.ts` é a **projeção** daquele arquivo:
mesma numeração, mesmo estado, mesma regra resumida. Um `.astro` sem entrada
no catálogo não é bloco, é componente solto.

**Chrome não é bloco.** Sumário, paginação, toast, overlay, barra de
progresso — o que serve a página, não a arquitetura de UM artigo — leva `id`
tipo `"N1"`..`"N5"`, estado `navegacao`, e nunca entra no campo `blocos` de um
site. Se o que você vai criar é chrome, siga o mesmo procedimento abaixo, só
pulando o passo do mock de artigo (chrome usa dado próprio, não `mock/artigo.ts`).

## Os doze erros que já aconteceram aqui

Cada um tem commit ou comentário no código. Leia antes de escrever a primeira
linha — é mais barato ler isto do que repetir o defeito.

1. **`[hidden]` perde da cascata.** O Astro injeta `data-astro-cid-*` nos
   seletores escopados: `.meu-bloco` fica com especificidade (0,2,0) e vence
   `[hidden]` (0,1,0). Um bloco com `display:` na própria classe e um elemento
   que nasce `hidden` fica **visível**. Já quebrou três blocos. A correção
   está no contrato, uma vez: `[hidden] { display: none !important }` em
   `web/src/styles/base.css` (commit `c015baa`). **Não remova o `!important`
   achando que é gambiarra** — é a regra sistêmica que evita remendo em cada
   componente. Se seu bloco usa `hidden`, ele já está coberto; não escreva
   `display: none` alternativo na sua classe.

2. **Bloco no catálogo tem de aparecer na bancada.** `SITE_DEMO.blocos` e a
   lista de `<Palco>` em `bancada.astro` já divergiram do catálogo: faltavam
   os blocos 23 e 24, e eles **não apareciam nem como ausentes**, porque a
   bancada itera sobre a lista do site, não sobre o catálogo (commit
   `162ad1f`). Por isso `SITE_DEMO.blocos` hoje é `CATALOGO.map(b => b.id)` —
   nunca lista digitada. A parte que ainda é manual é a chamada de `<Palco
   id={N}>` em `bancada.astro`: seu bloco novo entra ali, ou a contagem
   "X de Y blocos" mente sobre quantos blocos o chassi tem.

3. **O catálogo não pode mentir.** `estado: "ativo"` significa "a dependência
   deste bloco está no ar **neste repositório**", não "o bloco está pronto".
   O bloco 24 (Oferta de isca) chegou da extração como `estado: "ativo"`, com
   um comentário afirmando textualmente que "a oferta exige um endpoint, e
   ele existe em `functions/api/isca.ts`" — esse arquivo nunca existiu neste
   repositório, foi herdado de outro projeto (commit `c53f33e`, "fix(sites):
   conserta teste sem fronteira, valida SITE_DEMO e corrige catálogo"). O
   mais grave: a doutrina do próprio campo — "bloco ativo é bloco cuja
   dependência está no ar, não bloco sem dependência nenhuma" — já estava
   escrita três linhas acima, no comentário do bloco vizinho, e mesmo assim
   foi violada. Hoje 24 e 25 são `previsto`, cada um com o comentário dizendo
   qual endpoint falta (`/api/isca`, `/api/newsletter`) — ver `catalogo.ts`.
   Se o seu bloco depende de infraestrutura ausente, o estado é `previsto` e
   o comentário diz **qual** dependência falta, não só que falta uma — e você
   confere isso olhando o repositório, não copiando o que um comentário
   vizinho disse sobre outro bloco.

4. **Comentário que mente sobre o código é pior que nenhum.** `posthog.ts`
   tinha um comentário dizendo que o adaptador "ficaria pronto quando fosse
   ligado" — na prática, `.init()` chamado no array-stub estourava `TypeError`
   síncrono no `<head>` na primeira carga (commit `a3f5d95`). Se você não
   rodou o caminho de verdade (endpoint real, script de terceiro real), o
   comentário diz isso: "não testado contra o serviço real", nunca "funciona
   quando configurado".

5. **Bloco que depende de configuração ausente nasce inerte E visível.**
   Nunca um formulário que parece funcionar e engole o dado em silêncio. O
   padrão está em `Comentarios.astro` (variável `previa`) e foi repetido em
   `OfertaIsca.astro` no commit `162ad1f`: sem a env var ou o sitekey, o
   `<form>` sai sem `action`, os campos saem `disabled`, e uma frase visível
   diz **onde a resposta ficaria** se enviasse — "guardado neste navegador,
   ainda não há apuração", nunca "registrado" ou qualquer verbo que prometa
   entrega que não acontece.

6. **Melhoria progressiva não é opcional.** `output: "static"` é restrição
   real: crawler de IA não roda JavaScript. Rádio e checkbox continuam
   funcionando sem JS; JS é enriquecimento por cima (ver `Checklist.astro`,
   `Comentarios.astro`). Conteúdo revelado só no `:hover` não existe para
   celular nem para crawler — é a regra do bloco 27 (Passos com detalhe):
   detalhe sempre no HTML, hover revela em tela larga, sempre visível em tela
   estreita. Todo `<script>` que seu componente ganhar escreve, no comentário
   do frontmatter, o que quebra sem ele e por que o resto continua de pé —
   ver o frontmatter de `Codigo.astro` como modelo desse parágrafo.

7. **O bloco consome token; nunca o contrário.** Se falta uma medida, o token
   novo entra no contrato (`web/src/styles/base.css`), com o valor de hoje
   como padrão — nunca um valor fixo dentro do `<style>` do componente. O A2
   (listas) ficou meses com `padding-left: 1.35em` fixo em `atomos.css`
   enquanto card, tabela, botão e citação mudavam de cara em cada estilo; a
   lista era idêntica nos cinco (commit `c918ae4`). O sintoma de quem repete
   isso: o bloco novo fica visualmente idêntico do `linho` ao `circuito`
   enquanto tudo ao redor muda. Se seu bloco precisa de um valor que nenhum
   `--b-*` cobre, pare e abra o token antes de escrever o CSS do bloco.

8. **O espécime mostra os estados, não só o repouso.** `_BotoesDemo.astro` é
   o modelo: repouso e desabilitado são o HTML de sempre (`disabled`
   verdadeiro); hover e foco, que só existem com mouse ou Tab em cima, ganham
   classes `.demo-hover`/`.demo-foco` que **copiam byte a byte** a regra real
   de `atomos.css`/`base.css` só para ficarem legíveis parados — com
   comentário avisando que isso pode desatualizar se a regra original mudar.
   **Foco é o que o teclado enxerga e o que quebra sem ninguém notar** — se o
   seu bloco é interativo, o espécime mostra o foco, sempre.

9. **Ícone e cor nunca carregam significado sozinhos.** `Verificacao.astro`
   usa símbolos com formas diferentes entre si (não variações de peso ou cor
   da mesma forma) e cada item tem o texto do estado ao lado, porque leitor de
   tela e daltônico não recebem a cor. Todo estado do seu bloco — sucesso,
   erro, pendente, o que for — tem rótulo em texto, nunca só `aria-hidden` no
   ícone com a cor fazendo o trabalho.

10. **Dado de exemplo é público.** Este é o repositório aberto: mock e fixture
    de teste nunca levam nicho, domínio ou persona da holding. Já vazou
    `naopagueluz` (site real) em fixture de teste (commit `61b0abd`) — a
    correção trocou para `exemplo`/slugs genéricos. `mock/artigo.ts` é o
    lugar certo, e ele já é sobre roteador doméstico e Wi-Fi, sem marca real.

11. **Teste que passa com a implementação quebrada é pior que teste nenhum,
    porque dá confiança falsa.** O caso mais didático: o teste "conta o mesmo
    token nos dois modos uma só vez", em `web/src/sites/validacao.test.ts`,
    usava **um** token repetido em `claro` e `escuro`. Contado certo (uma vez)
    dava 1; contado errado, em dobro, dava 2 — e o teto era 6. O teste nunca
    chegava perto da fronteira que dizia exercitar, então continuava verde com
    o dedupe quebrado. Um revisor só viu o defeito quebrando o dedupe de
    propósito e vendo o teste **continuar passando** (commit `c53f33e`). O
    conserto usa quatro tokens distintos nos dois modos: deduplicado dá 4
    (abaixo do teto, `not.toThrow()`), sem dedupe dá 8 (acima do teto) — agora
    o teste tem para onde cair. A prova de que um teste seu presta é sempre a
    mesma, automatizado ou verificação manual de CSS (item 12): quebre a
    implementação de propósito, veja falhar; desfaça a quebra, veja passar.

12. **CSS não se prova com `grep` no HTML.** Se o comportamento do seu bloco
    depende de cascata — `[hidden]`, `@layer`, um seletor que só vence por
    ordem de camada — um `grep` que encontra o atributo `hidden` na marcação
    não prova que o elemento está oculto na tela. Meça no navegador
    (`getComputedStyle` no elemento, via DevTools ou um teste que sobe
    página) ou explique, por escrito, por que a combinação HTML+CSS resolve.

## O procedimento

1. **Bloco de artigo ou chrome?** Se a peça é escolhida por artigo e entra na
   arquitetura de UM texto, é bloco (id numérico). Se serve a página inteira
   — navegação, feedback de ação, progresso — é chrome (`id` `"N1"`..`"N5"`,
   `estado: "navegacao"`). Um átomo (`"A1"`..`"A3"`) é o que a prosa usa sem
   escolher: você quase nunca cria um átomo novo, os três já cobrem prosa,
   listas e botões.

2. **Entrada no catálogo.** A doutrina nasce em
   `.claude/skills/artigo/referencias/arquitetura-pagina.md`, com a regra por
   extenso. Só depois o resumo entra em `web/src/catalogo.ts`, no array
   `CATALOGO`: `id`, `nome`, `estado` (explícito — nunca deduza de faixa
   numérica, ver o comentário do campo `estado` no arquivo) e `regra`
   resumida. Se o bloco precisa de infraestrutura que este repositório não
   tem, o estado é `previsto`, com o comentário dizendo qual dependência
   falta (erro 3).
   Verificação: `cd web && npm run check` ainda passa (o tipo `BlocoId` cresce
   sozinho a partir do literal novo, mas confira que nada mais no arquivo
   quebrou o tipo).

3. **O componente.** Um `.astro` novo em `web/src/components/blocos/`. Fale
   só `--b-*` no `<style>` — nenhum literal de cor, fonte ou medida (erro 7).
   Se o bloco tem trava que quebra a build (alt vazio, fonte obrigatória,
   rótulo ausente), o padrão é `Figura.astro`/`Aviso.astro`/`Codigo.astro`:
   uma função `erro(msg)` que dá `throw new Error("[bloco N] ...")` no
   frontmatter, antes do template, com a mensagem explicando o porquê da
   trava, não só o quê. Se o bloco depende de configuração externa (endpoint,
   sitekey, env var), o padrão é `Comentarios.astro`: uma variável `previa`
   que desliga `action`, desabilita campos e mostra a frase visível (erro 5).
   Se o bloco ganha `<script>`, o comentário do frontmatter diz o que quebra
   sem JS e por que o resto sobrevive (erro 6).

4. **Tokens, só se faltarem.** Rode o componente num estilo antes de assumir
   que falta token — os cinco estilos (`linho`, `concreto`, `vidro`,
   `circuito`, `ceu`) juntos são a referência de quais `--b-*` já existem.
   Faltando um, ele entra em `web/src/styles/base.css`, na camada `contrato`,
   com o valor de hoje como padrão — nunca fixo dentro do bloco (erro 7). Só
   depois, se cada estilo quiser um valor próprio, ele entra em
   `web/src/styles/estilos/<nome>.css`, dentro do `[data-estilo="<nome>"]`
   correspondente — nunca um seletor mirando dentro do bloco.

5. **Espécime e bancada.** Bloco simples usa o próprio componente direto num
   `<Palco>`; bloco sem instância de artigo (átomo, ou algo com muitos
   estados como botão) ganha um `_NomeDemo.astro` — o padrão é
   `_BotoesDemo.astro` (repouso, hover congelado, foco congelado,
   desabilitado — erro 8) ou `_ListasDemo.astro` (as variações lado a lado).
   Em `web/src/pages/bancada.astro`: importe o componente, acrescente
   `<Palco id={N} {...palco}>...</Palco>` na lista dentro de `<main
   class="blocos">`, na posição que respeita a ordem de leitura do catálogo
   (não a ordem de import). Se o bloco tem papéis diferentes (como Figura:
   prova/diagrama/spot) ou estados diferentes (como Aviso: atenção/nota),
   mostre todos no mesmo palco — é o único lugar onde dá para comparar de um
   olhar.
   Verificação do passo (erro 2): depois de rodar `npm run bancada`, contar
   quantos `data-suportado="sim"` existem no HTML gerado e bater com
   `CATALOGO.length` (todo bloco ativo/previsto/derivado/átomo deveria contar,
   já que `SITE_DEMO.blocos` é o catálogo inteiro) — ver "como saber que
   terminou" abaixo para o comando exato.

6. **Mock.** Dado fictício para o espécime entra em `web/src/mock/artigo.ts`
   (nunca nome, domínio ou persona real — erro 10). Se o bloco tem trava de
   integridade (fonte, ressalva, lacuna declarada), o mock exercita a trava:
   é o que prova que ela existe, não só que existiria.

7. **Lista de blocos de um site, se aplicável.** Um site real (não a
   bancada) só monta o bloco se ele entrar no array `blocos` de
   `web/src/sites/<slug>.ts` — nunca em `web/src/sites/index.ts`, que só varre
   e valida. Isso é decisão do dono de cada site, então esta skill não decide
   por ele; ela só garante que o bloco existe para ser escolhido.

8. **Montagem no artigo de exemplo, se couber.** `web/src/pages/[artigo].astro`
   é dirigido por dado: cada artigo em `mock/artigos.ts` é uma lista de
   slots, e o arquivo só sabe desenhar cada `tipo` de slot que já existe.
   Bloco novo que deveria aparecer num artigo de exemplo pede um `case` novo
   no `s.tipo === "..."` daquele arquivo E um slot novo em algum artigo de
   `mock/artigos.ts` — sem os dois, o componente existe mas nunca aparece
   fora da bancada. Pule este passo para chrome (N1-N5), que não é slot de
   artigo.

## Como saber que terminou

Os comandos que precisam passar, todos de dentro de `web/`:

```
npm test               # vitest: trava do bloco tem teste que discrimina (erro 11)
npm run check          # astro check
npm run check:functions
npm run build          # sem NENHUMA variável de ambiente — bloco previsto
                        #   ou com config ausente tem de sair inerte, não quebrar
```

Mais as verificações específicas de bloco novo:

- **A contagem da bancada bate.** Depois de `npm run bancada`:
  ```
  grep -o 'data-suportado="sim"' ../bancada.html | wc -l
  ```
  compare com o total de entradas em `CATALOGO` (`web/src/catalogo.ts`). Se
  faltar um, o bloco novo não entrou no `<Palco>` de `bancada.astro`, ou
  `SITE_DEMO.blocos` voltou a divergir do catálogo (erro 2).

- **Nenhum `action` aponta para endpoint inexistente no HTML gerado.** Se o
  bloco tem `<form>`, confira no HTML de build que, sem a env var configurada,
  não sobra `action="/api/..."` nenhum apontando para uma Function que não
  existe em `web/functions/api/` (erro 5):
  ```
  grep -o 'action="[^"]*"' ../bancada.html
  ls web/functions/api/
  ```

- **Se o bloco depende de cascata (`[hidden]`, `@layer`, ordem de camada),
  meça no navegador — `getComputedStyle` no elemento — em vez de só `grep`
  no HTML (erro 1 e erro 12). Um `grep` que acha `hidden` na marcação não diz
  se o elemento está realmente oculto na tela.

- **Se você escreveu um teste novo, quebre a implementação de propósito e
  veja o teste falhar antes de aceitar que ele prova algo** (erro 11).

## O que nunca fazer

- Criar um `.astro` em `components/blocos/` sem entrada correspondente em
  `catalogo.ts` — isso não é bloco, é componente órfão que ninguém encontra.
- Declarar `estado: "ativo"` para um bloco cuja dependência (endpoint, conta,
  serviço) não existe neste repositório.
- Escrever cor, fonte ou medida literal dentro do `<style>` de um bloco — se
  falta token, o token nasce no contrato, nunca como valor fixo no bloco.
- Deixar um formulário sem configuração sair com `action` de verdade, campos
  habilitados e nenhum aviso visível de que a resposta não vai a lugar
  nenhum.
- Remover ou enfraquecer `[hidden] { display: none !important }` em
  `base.css` para "resolver" um bloco que nasce visível — o bug está no
  seletor do bloco, não no contrato.
- Aceitar um teste como prova sem antes vê-lo falhar contra uma implementação
  quebrada de propósito.
