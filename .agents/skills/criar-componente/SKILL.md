---
name: criar-componente
description: Use quando o dono quiser um bloco novo no catálogo do chassi ou um componente de chrome novo — "cria um bloco para X", "falta um bloco de Y no catálogo", "quero um componente novo para o artigo". Conduz do catálogo ao componente, aos tokens que faltarem, ao espécime na bancada e ao mock, e reúne os erros reais que já quebraram bloco aqui para não repeti-los.
---

# Criar um bloco novo

Um bloco é uma peça de artigo com regra própria. A doutrina deveria nascer em
`.claude/skills/artigo/referencias/arquitetura-pagina.md`, mas **esse arquivo
não existe neste repositório** — é referência herdada de um projeto-pai
(aparece citada em vários comentários do código, inclusive no docstring de
`web/src/catalogo.ts`, mas um `find` no chassi não acha o arquivo em lugar
nenhum). Não perca tempo procurando: aqui a autoridade de fato é o comentário
de cada `.astro` mais o resumo em `web/src/catalogo.ts`, no array `CATALOGO`
— mesma numeração, mesmo estado, mesma regra resumida que aquele arquivo
ausente prometeria ter. Um `.astro` sem entrada no catálogo não é bloco — mas
"sem entrada no catálogo" cobre duas coisas bem diferentes, e a primeira
decisão é qual das duas é a sua.

## Bloco de catálogo, ou chrome de site?

**Entra no catálogo** (e por isso na bancada) o que uma ARQUITETURA escolhe
montar — decisão por artigo, ou por página de navegação, com instância
própria: Toast leva título e texto por chamada, Overlay leva um gatilho,
Paginação leva total e página atual. `BlocoId`, em `catalogo.ts`, tem três
faixas:

- **`1`..`28`, bloco de artigo.** Site declara em `blocos`. O número é
  histórico, não a ordem de leitura nem a faixa em si — o bloco 19 lê entre
  10 e 11 — e o `estado` é sempre explícito, nunca deduzido do número.
- **`"N1"`..`"N5"`, chrome de NAVEGAÇÃO.** Serve a página, não a arquitetura
  de UM artigo, mas ainda tem instância própria e ainda aparece na bancada.
  **As cinco vagas já estão ocupadas hoje**: Paginação, Card de artigo, Toast
  de aviso, Overlay de tela cheia, Barra de progresso. Ver "Cheio, e agora?"
  abaixo antes de pensar numa sexta.
- **`"A1"`..`"A3"`, átomo.** O que a prosa usa sem escolher. **Também cheio**
  hoje (Prosa e seus átomos, Listas, Botões) — você quase nunca cria um
  átomo novo.

**Nunca entra no catálogo** o que é decisão única do site inteiro: liga ou
desliga uma vez, como cabeçalho ou rodapé, nunca algo que um artigo escolhe
montar — e por isso nunca aparece na bancada nem no campo `blocos`. É
**chrome de site**: mora direto em `web/src/components/` (não em
`components/blocos/`), ganha campo próprio e tipado em `Site` (não a lista
`blocos`), e monta em `web/src/layouts/Base.astro` atrás do gate `{site &&
<X site={site} />}` — o mesmo gate que já existe para nada montar na
bancada, porque `Base` só recebe `site` fora dela. Os quatro que existem
hoje: `Cabecalho.astro`, `Rodape.astro`, `Consentimento.astro` e
`BarraAviso.astro`. Nenhum tem `id` em `catalogo.ts`, e é assim que deve
continuar.

Critério, resumido: **tem instância própria, artigo a artigo (ou página a
página), e faz sentido lado a lado na bancada? Catálogo.** **É uma decisão
única do site, sempre igual em toda página? Chrome de site, fora do
catálogo.**

### Cheio, e agora?

Não invente `"N6"` nem `"A4"` só porque o slot mais parecido está ocupado —
`BlocoId` é um union de literais fixo, e abrir uma vaga é mudar o tipo, uma
decisão grande demais pra tomar sozinho no meio de escrever um componente.
Releia o critério acima primeiro: na prática, quase todo candidato a "N6" é
chrome de site disfarçado — o caso real foi `BarraAviso.astro`: o primeiro
instinto foi encaixá-la em N porque "N já significa chrome", e o lugar certo
era fora do catálogo, ao lado de `Cabecalho`/`Rodape`/`Consentimento`. Se
depois de aplicar o critério ainda sobrar um caso genuíno de navegação com
instância própria, pare e leve a decisão de abrir uma vaga nova para o dono,
não decida sozinho.

## Os treze erros que já aconteceram aqui

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

13. **O teste discriminante pega o erro de quem o escreveu, não só o do
    vizinho.** Ao escrever a validação de `avisoBarra` em
    `web/src/sites/validacao.ts` (commit `250601f`), o `if (site.avisoBarra)
    {...}` novo foi posto DEPOIS do `if (!site.tokens) continue;` já
    existente — qualquer site sem `tokens` pulava a checagem inteira, e os
    dois testes de recusa (texto vazio, link pela metade) passavam **verdes
    sem checar nada**. Rodar a suíte de verdade, em vez de assumir que
    passava, pegou o bug na hora, antes do commit. É o mesmo erro 11, mas
    provado ao vivo, no próprio código de quem seguia a doutrina — não só no
    exemplo didático do dedupe de token. A régua não muda: escreva a
    checagem, rode contra os dois lados (aceita e recusa), e só então confie
    que ela discrimina.

## O procedimento

0. **Antes de criar: essa forma já existe?** Antes de abrir o catálogo ou um
   `.astro`, leia `web/src/catalogo.ts` inteiro e liste
   `web/src/components/blocos/`. O que você procura não é o mesmo nome — é a
   mesma **forma**: mesma marcação, mesmos slots, mesmo desenho. O critério é
   este: **o catálogo separa por regra; o componente compartilha por forma.**
   Regra nova sempre ganha entrada nova no catálogo, isso não está em questão;
   o que está em questão é se ela também precisa de um `.astro` do zero. Os
   dois lados já existem neste repositório, e a diferença entre eles é o
   teste:

   - **Compartilha (blocos 4 e 5).** `TabelaPanorama.astro` e
     `TabelaContraste.astro` são duas entradas de catálogo com doutrina
     diferente — panorama derruba a coluna inteira quando falta célula,
     contraste exige as duas colunas apuradas na mesma base — e mesmo assim
     os dois arquivos são idênticos byte a byte: mesma `interface Props`,
     ambos só delegando para `_Tabela.astro`. A regra vive no comentário do
     frontmatter e na entrada do catálogo; a forma vive num arquivo só.
   - **Não compartilha (blocos 6 e 7).** `CitacaoDestacada.astro` e
     `CitacaoFonte.astro` parecem primos tão próximos quanto os de cima, e
     foram deliberadamente mantidos separados: o 7 tem `nome`, `papel` e
     `conflito` — este último obrigatório, porque "a neutralidade não se
     presume" —, o 6 tem só `texto` e um teto de duas por artigo. O
     comentário do 6 fecha a questão em uma linha: "as regras não se
     misturam".

   O desempate, na dúvida: se as duas regras têm travas diferentes (um
   `erro(...)` no frontmatter, como em `Figura.astro`), são dois componentes.
   Se a única diferença é qual texto o dono passa em qual prop, é um
   componente e dois invólucros finos — e o passo 3 vira escrever nove
   linhas, não um bloco inteiro.

1. **Catálogo ou chrome de site?** Aplique o critério da seção "Bloco de
   catálogo, ou chrome de site?" no topo desta skill. Três faixas dentro do
   catálogo (`1`..`28` bloco de artigo; `"N1"`..`"N5"` navegação; `"A1"`..`"A3"`
   átomo — as duas últimas hoje cheias, ver "Cheio, e agora?"), e uma família
   inteira fora dele: chrome de site (`Cabecalho`, `Rodape`, `Consentimento`,
   `BarraAviso`, direto em `web/src/components/`, sem entrada em
   `catalogo.ts`). Escolhendo **chrome de site**, pule os passos 5 (bancada —
   ele nunca aparece lá, porque `Base` só recebe `site` fora dela), 6 (mock —
   lê o campo próprio de `Site`, não `mock/artigo.ts`), 7 e 8 (não há
   `blocos` de site nem slot de artigo pra montar) e vá direto do passo 3
   para "Como saber que terminou". Escolhendo **chrome de navegação** (`N`),
   o procedimento é o mesmo do bloco de artigo, só pulando o passo 6 (mock —
   usa dado próprio) e o passo 8 (não é slot de artigo).

2. **Entrada no catálogo.** A regra por extenso mora no comentário do próprio
   `.astro` (o docstring de `catalogo.ts` aponta para
   `.claude/skills/artigo/referencias/arquitetura-pagina.md` como autoridade
   — esse arquivo não existe neste repositório, ver o segundo parágrafo desta
   skill). O resumo entra em `web/src/catalogo.ts`, no array `CATALOGO`:
   `id`, `nome`, `estado` (explícito — nunca deduza de faixa numérica, ver o
   comentário do campo `estado` no arquivo) e `regra` resumida. Se o bloco
   precisa de infraestrutura que este repositório não tem, o estado é
   `previsto`, com o comentário dizendo qual dependência falta (erro 3).
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

   Se o que você está escrevendo é chrome que o leitor **fecha** (aviso,
   banner, promoção), três técnicas já têm precedente aqui e valem juntas —
   a mesma combinação usada em `Checklist.astro`, `Consentimento.astro` e,
   de ponta a ponta, em `BarraAviso.astro`/`web/src/avisoBarra.ts`:
   - **Fechar sem JavaScript.** `<input type="checkbox">` oculto só
     visualmente (não `display:none`/`hidden` — continua alcançável por Tab,
     aciona por Espaço) associado a um `<label>` que faz as vezes de botão de
     fechar, mais CSS puro (`:checked ~ .o-que-fecha { display: none }`).
     Quem tem JS desligado fecha do mesmo jeito; o script, se existir, só
     acrescenta memória entre páginas.
   - **`position: sticky`, nunca `fixed` + espaçador.** Um elemento fixo no
     topo que empurra o resto precisa reservar espaço à parte — `fixed` tira
     do fluxo normal e exige medir a altura por fora (e reagir se ela mudar,
     como texto quebrando em duas linhas no celular). `sticky` no próprio
     elemento continua no fluxo: reserva e devolve o espaço sozinho, em
     qualquer altura, sem cálculo nenhum.
   - **Guarde o conteúdo dispensado, nunca um booleano.** Mesma doutrina de
     `web/src/consentimento.ts` ("guarda-se a frase, e não um booleano
     solto: a frase muda com o tempo, e o que a pessoa aceitou foi a frase
     daquele dia"), aplicada aqui ao fechar em vez de ao aceitar: guarde o
     TEXTO fechado no `localStorage` (`avisoBarra.ts` é o modelo, com
     `foiFechada(armazenado, textoAtual)` puro e testável sem DOM), nunca só
     a presença de uma chave. Texto novo é aviso novo — quem fechou o texto
     de ontem volta a ver o de hoje. Guardar só um booleano (`fechou: true`)
     é a versão que parece funcionar e falha exatamente no dia em que o
     conteúdo muda.

4. **Tokens, só se faltarem.** Rode o componente num estilo antes de assumir
   que falta token — os cinco estilos (`linho`, `concreto`, `vidro`,
   `circuito`, `ceu`) juntos são a referência de quais `--b-*` já existem.
   Faltando um, ele entra em `web/src/styles/base.css`, na camada `contrato`,
   com o valor de hoje como padrão — nunca fixo dentro do bloco (erro 7). Só
   depois, se cada estilo quiser um valor próprio, ele entra em
   `web/src/styles/estilos/<nome>.css`, dentro do `[data-estilo="<nome>"]`
   correspondente — nunca um seletor mirando dentro do bloco.

5. **Espécime e bancada.** (Chrome de site — `Cabecalho`/`Rodape`/
   `Consentimento`/`BarraAviso` — não passa por este passo: ele nunca entra
   na bancada.) Bloco simples usa o próprio componente direto num `<Palco>`;
   bloco sem instância de artigo (átomo, ou algo com muitos estados como
   botão) ganha um `_NomeDemo.astro` — o padrão é `_BotoesDemo.astro`
   (repouso, hover congelado, foco congelado, desabilitado — erro 8) ou
   `_ListasDemo.astro` (as variações lado a lado). Em
   `web/src/pages/bancada.astro`: importe o componente, acrescente `<Palco
   id={N} {...palco}>...</Palco>` na lista dentro de `<main class="blocos">`,
   na posição que respeita a ordem de leitura do catálogo (não a ordem de
   import). Se o bloco tem papéis diferentes (como Figura:
   prova/diagrama/spot) ou estados diferentes (como Aviso: atenção/nota),
   mostre todos no mesmo palco — é o único lugar onde dá para comparar de um
   olhar.
   Verificação do passo (erro 2): depois de rodar `npm run bancada`, contar
   quantas seções `class="bloco"` existem no HTML gerado e bater com
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

- **A contagem da bancada bate.** (Não se aplica a chrome de site — ele nunca
  entra na bancada.) `Palco.astro` não emite mais `data-suportado`: o
  atributo foi removido no commit `65efbee`, junto com código morto de um
  mecanismo de suporte por estilo que não existe mais — um `grep` por ele
  hoje dá zero sempre, para qualquer bloco, certo ou errado. O marcador vivo
  é a própria seção do bloco, `class="bloco"`. Depois de `npm run bancada`:
  ```
  grep -o 'class="bloco"' ../bancada.html | wc -l
  ```
  compare com o total de entradas em `CATALOGO` (`web/src/catalogo.ts` — hoje
  36). **Use `grep -o ... | wc -l`, nunca `grep -c`**: o HTML da bancada sai
  em poucas linhas bem longas, então `grep -c` conta *linhas* com pelo menos
  uma ocorrência, não ocorrências — testado contra o HTML de verdade, `grep
  -c 'class="bloco"'` deu `3` (três linhas que contêm a classe) contra os
  `36` blocos reais que `grep -o | wc -l` encontrou. Se a contagem certa não
  bater, o bloco novo não entrou no `<Palco>` de `bancada.astro`, ou
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
  meça no navegador de verdade — não só leia o CSS.** A skill `agent-browser`
  (disponível nesta sessão) sobe um Chromium de verdade e prova três coisas
  que `grep` no HTML não prova: `getComputedStyle` do elemento (erro 1 e
  erro 12 — um `grep` que acha `hidden` na marcação não diz se o elemento
  está realmente oculto na tela), estado que só existe depois de um script
  rodar (clique, evento, `localStorage`), e o caminho **sem JavaScript**. Para
  provar o caminho sem JS de forma defensável, não desligue JS na mão: bloqueie
  o `<script>` por rota de rede (`agent-browser network route "*" --abort
  --resource-type script`) e repita a interação — se o comportamento continua
  idêntico com zero script executado, a melhoria progressiva está provada,
  não só declarada no comentário.

- **Se você escreveu um teste novo, quebre a implementação de propósito e
  veja o teste falhar antes de aceitar que ele prova algo** (erro 11).

## O que nunca fazer

- Criar um `.astro` em `components/blocos/` sem entrada correspondente em
  `catalogo.ts` — isso não é bloco, é componente órfão que ninguém encontra.
- Criar um `.astro` do zero para um bloco cuja forma já existe em
  `components/blocos/` — regra nova é entrada nova no catálogo, não
  necessariamente arquivo novo (passo 0: os blocos 4 e 5 dividem
  `_Tabela.astro`).
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
- Inventar `"N6"` ou `"A4"` por reflexo só porque a faixa mais parecida está
  cheia — releia primeiro o critério de bloco de catálogo vs. chrome de site.
- Guardar um booleano (`fechou: true`, `jaViu: true`) para lembrar que o
  leitor dispensou algo que pode mudar de conteúdo — guarde o que foi
  dispensado, ou o aviso seguinte nasce escondido por engano.
