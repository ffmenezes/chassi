---
name: artigo
description: Use quando o dono quiser produzir artigo para um site em `sites/<slug>/` — "gera ideias pro site", "fecha a pauta de X", "escreve o artigo sobre Y", "revisa o rascunho", "o que dá pra publicar essa semana". Conduz em oito etapas com estado em disco (ideias, pauta, dossiê, esqueleto, capítulos, costura, revisão, entrega), cada uma executável sozinha por um modelo pequeno. Nunca inventa número, nunca inventa link interno, nunca publica sem um dado próprio.
---

# Produzir um artigo

Um artigo aqui é uma peça que ganha uma busca real com um dado que a
página do concorrente não tem. O método existe para que isso saia **3 a 5
vezes por semana sem virar fábrica de texto igual**: o Google derruba site
inteiro por padrão de produção (volume, template repetido, zero valor
próprio), não por "ter usado IA". A defesa é a mesma coisa que faz o artigo
valer: um dado apurado por peça, autor real assinando, estrutura que a
pauta pede e não a que o molde deu.

**A regra que sustenta tudo: nenhum número entra no texto sem um bloco no
dossiê com fonte e data.** Quem escreve o capítulo não apura; quem apura
não redige; quem costura não muda fato. Um modelo pequeno executa bem uma
etapa por vez com o arquivo certo aberto. É por isso que o estado vive em
disco, nunca na conversa.

## Antes de qualquer etapa

1. Descubra o site: `ls sites/` menos `_modelo`. Se houver mais de um e o
   pedido não disser qual, pergunte.
2. Abra `sites/<slug>/base/TERRITORIO.md` e `base/LEITOR.md`. Se qualquer
   um ainda tiver as perguntas do stub visíveis, **pare**: sem território e
   leitor não existe pauta, só tema. Diga ao dono qual arquivo falta.
3. Abra `sites/<slug>/estado/CLUSTER.md`. É a autoridade sobre slug,
   query-alvo e status de toda peça. Nada do que você escrever contradiz
   uma linha de lá; se precisar, acrescenta linha nova.
4. Liste `pautas/`, `pesquisa/<peça>/` e `posts/<peça>/` (incluindo
   `capitulos/`) e descubra a etapa pelo disco. Existência de arquivo não
   prova conclusão: confira a checagem da etapa que o produziu. Arquivo
   parcial retoma essa etapa. Aplique primeiro `descartada`, `publicado`
   e `pronto` do `CLUSTER.md`; depois, o último veredito da revisão; só
   então procure o artefato concluído mais adiantado nesta tabela:

| Se existe | A peça está em | Próxima etapa |
|---|---|---|
| nada | sem candidatas | `etapas/00-ideias.md` |
| `pautas/_candidatas.md`, com candidata aprovada e escolhida | ideias | `etapas/01-pauta.md` |
| `pautas/<slug>.md`, checagem completa | pauta | `etapas/02-dossie.md` |
| `pesquisa/<slug>/dossie.md`, checagem completa | dossiê | `etapas/03-esqueleto.md` |
| `posts/<slug>/esqueleto.md` com `CONGELADO` | esqueleto | `etapas/04-capitulos.md` |
| capítulos faltando ou incompletos | redação em andamento | `etapas/04-capitulos.md`, primeiro C pendente |
| `posts/<slug>/capitulos/NN-*.md`, todos os C do esqueleto completos | capítulos | `etapas/05-costura.md` |
| `posts/<slug>/post.md` | costurado | `etapas/06-revisao.md` |
| `posts/<slug>/revisao.md` com `VEREDITO: aprovado` | revisado | `etapas/07-entrega.md` |
| linha `pronto` no `CLUSTER.md` | entregue | nada: espera a página (o dono marca `publicado`) |
| linha `publicado` no `CLUSTER.md` | no ar | manutenção (fora deste método) |
| linha `descartada` no `CLUSTER.md` | abandonada, com motivo | nada; só reabra por pedido do dono |

`revisao.md` pode nascer na costura só com observações: sem veredito,
rode a etapa 6. Se o último veredito é `devolvido à etapa N`, retome N
para o item nomeado; depois confira as etapas dependentes. `reprovado`
retoma a revisão até o teto de três rodadas; diagnóstico na terceira
reprovação espera o dono. Uma aprovação antiga nunca vence uma devolução
mais recente. Sem candidata escolhida, termine a etapa 0.

Sem nenhuma peça em andamento e sem pedido específico, rode
`etapas/00-ideias.md`.

## As oito etapas

| # | Etapa | Lê | Escreve |
|---|---|---|---|
| 0 | Ideias | `base/`, `estado/TESE.md`, `estado/CLUSTER.md` | `pautas/_candidatas.md` (append) |
| 1 | Pauta | uma candidata, `CLUSTER.md`, `base/POSTURAS.md` | `pautas/<slug>.md`, linha no `CLUSTER.md` |
| 2 | Dossiê | a pauta, `base/PROVAS.md`, `base/EDITORIAL.md` | `pesquisa/<slug>/dossie.md` |
| 3 | Esqueleto | pauta, dossiê, `referencias/plantas.md`, `referencias/quando-cada-bloco.md` | `posts/<slug>/esqueleto.md` (congela) |
| 4 | Capítulos | esqueleto, dossiê, `base/TOM.md`, `base/POSTURAS.md` | `posts/<slug>/capitulos/NN-<h2>.md`, um por vez |
| 5 | Costura | todos os capítulos, esqueleto | `posts/<slug>/post.md` |
| 6 | Revisão | `post.md`, dossiê, `CLUSTER.md`, `referencias/antipadroes.md` | `posts/<slug>/revisao.md`, `post.md` corrigido |
| 7 | Entrega | `post.md`, `referencias/blocos.md`, `web/src/sites/<slug>.ts` | `CLUSTER.md` (status), pendências para o dono |

O mapa das oito etapas, com arquivos, status e voltas previstas, está em
`referencias/fluxo.md` (um diagrama Mermaid). Cada arquivo em `etapas/` é
autossuficiente: diz o que ler, o que escrever
(com gabarito literal), as regras numeradas, a checagem antes de fechar e o
que fazer quando travar. **Abra só a etapa que vai executar.** Ler as oito
de uma vez é o que torna o método lento; executar uma por vez é o que faz
um modelo pequeno acertar.

Modelo grande pode encadear etapas na mesma sessão. Mesmo assim, escreve o
arquivo de cada etapa antes de começar a seguinte, porque é o arquivo que
a próxima etapa lê, e é o arquivo que permite parar e retomar.

## Regras que valem em todas as etapas

1. **Número sem bloco no dossiê não existe.** Vale para o texto, para o
   título, para a description e para a tabela. A marca de origem viaja com
   o número: `[FONTE]`, `[ESTIMATIVA]`, `[PREMISSA]`, `[SEM DADO]`. Fatos
   usados em conta vêm de `[FONTE]`; resultados calculados mantêm os D de
   origem e a conta. Estimativas e premissas só entram nos usos rotulados
   da tabela da etapa 2. Ver `etapas/02-dossie.md`.
2. **Slug nasce no `CLUSTER.md`.** Link interno só para slug que está lá
   com status `publicado`. Link para slug em outro status vira
   `[LINK PENDENTE: slug]` e fica na lista de pendências da entrega.
3. **Um artefato, um dono por vez.** Nunca duas sessões no mesmo arquivo.
   Exceção protocolada: `CLUSTER.md`, uma linha por slug, prosa append-only,
   tabela nunca reordenada.
4. **Esqueleto congelado não muda na redação.** Redator que discorda de um
   número para, anota em `posts/<slug>/esqueleto.md` na seção `Objeções` e
   devolve à etapa 3. Não corrige na prosa.
5. **Correção é cirúrgica.** Um defeito por edição, no formato
   `LINHA / TRECHO / PROBLEMA / CORREÇÃO`. Máximo três rodadas de revisão;
   na terceira reprovação, entrega o diagnóstico em vez do texto.
6. **"Apurar" é verbo reservado.** Só descreve fonte aberta, com data. Para
   resumo de busca não aberto, a frase é "li no resumo de busca, não abri".
7. **Todo artigo tem ao menos um dado nosso**, com data e método: preço em
   duas lojas hoje, norma lida no texto oficial, simulador rodado, medição.
   Sem isso a peça não passa da etapa 2.
8. **Dois artigos do mesmo site não repetem o esqueleto de H2.** A planta dá
   a ordem das perguntas; a pauta dá as perguntas. Se dois esqueletos ficam
   iguais trocando o substantivo, um dos dois está errado. A regra é
   **entre peças**: dentro de uma peça, três capítulos com a mesma forma
   (uma faixa, uma categoria, um preço por capítulo) são legítimos quando
   o contrato pediu os três, e aí o bloco (tabela, checklist) entra só no
   primeiro deles; os outros são prosa que aponta para a tabela.
9. **O texto não esconde como foi feito.** O que `base/DECLARACOES.md`
   manda declarar (IA, afiliado, produto próprio) aparece na peça. Byline é
   pessoa real de `base/AUTOR.md`; sem ela o bloco 22 não nasce e a peça
   não é entregue.

10. **Toda etapa deixa rastro no diário da peça.** `posts/<peça>/diario.md`
    nasce na etapa 1 e recebe uma entrada por etapa executada: o que foi
    feito, o que foi decidido e contra quais alternativas, o que foi
    descartado ou adiado (e para onde), onde travou. É o que responde
    "por que a peça ficou assim" seis meses depois, e o que permite a
    outra sessão retomar sem reler tudo. O gabarito está no fim deste
    arquivo.

## O ritmo: 3 a 5 por semana sem virar escala

- Ideias em lote (etapa 0) uma vez por semana ou por quinzena; as outras
  etapas, uma peça por vez.
- Um pilar por cluster (planta explicativa grande ou seleção) e ao menos
  uma peça de veredito por mês. Sem pilar, satélite é folha solta. As
  seis plantas estão em `referencias/plantas.md`; a de relato é a única
  em que a experiência própria é a peça inteira.
- Antes de abrir peça nova, a pergunta é "tem peça publicada com dado
  vencido?". Atualizar o que existe vem antes de publicar mais.
- Volume acompanha o histórico do domínio: site novo publica dezenas por
  mês, não centenas. Se a fila de candidatas passa de 30, o problema não é
  falta de ideia.

## O que sai de cada peça, e onde

```
sites/<slug>/
  pautas/_candidatas.md            etapa 0, append-only
  pautas/<peça>.md                 etapa 1
  pesquisa/<peça>/dossie.md        etapa 2 (prints e PDFs ao lado)
  posts/<peça>/esqueleto.md        etapa 3, congela
  posts/<peça>/capitulos/NN-*.md   etapa 4, um por H2
  posts/<peça>/post.md             etapa 5, corrigido na 6
  posts/<peça>/revisao.md          etapa 6
  posts/<peça>/diario.md           etapas 1 a 7, uma entrada por etapa, append-only
  posts/<peça>/links.md            etapa 7; o dono decide cada link antes de `publicado`
  posts/<peça>/comentarios.json    fora do método; a build lê, ver posts/README.md
  estado/CLUSTER.md                linha da peça; status muda em 1, 2, 3, 4, 6 e 7
```

Status no `CLUSTER.md`, nesta ordem e só nesta:
`pauta` → `dossie` → `esqueleto` → `rascunho` → `revisado` → `pronto` →
`publicado`. O método vai até `pronto`; `publicado` é a página no ar, e quem
marca é o dono (ou o encanamento, quando existir), **depois de decidir o
`links.md`** que a etapa 7 gera: todo link do corpo com a coluna "decisão
do dono" (manter, trocar por afiliado, trocar a fonte, remover). Link é a
única coisa da peça que o método não decide sozinho, porque afiliado,
parceria e fonte preferida são do dono. Link interno só aponta
para `publicado`. Peça abandonada recebe `descartada` e o motivo na prosa;
a linha fica.

## O encanamento que ainda não existe

`post.md` hoje **não vira página sozinho**: a junta que `[artigo].astro`
lê é `web/src/mock/artigos.ts`, e o parser de markdown para a lista de
slots ainda não foi escrito. A sintaxe de bloco em `referencias/blocos.md`
é o contrato que esse parser vai honrar; escrever nela agora é o que
permite ligar o encanamento depois sem reescrever peça. Até lá, a etapa 7
entrega a peça como pronta e lista o que o dono precisa fazer à mão.

Imagens do participante também não têm lugar decidido (`web/src/imagens/`
é do upstream). A figura entra na peça com `src` pendente e a etapa 7
lista o arquivo. Ver `referencias/blocos.md`.

## Os erros que já aconteceram e viraram regra

Cada um custou uma rodada ou uma peça no repositório de origem, em agosto
de 2026. Estão aqui para não se repetir.

- **Redator calculando enquanto escrevia 6 mil palavras** publicou arranjo
  que nunca fechava a conta. Virou o esqueleto congelado antes da prosa
  (etapa 3), com contas refeitas antes de qualquer parágrafo.
- **Corretor com licença de reescrever** corrigiu seis defeitos e criou
  dois: reancorou uma afirmação órfã na fonte vizinha (citação falsa) e
  arredondou 3,26 módulos para 3. Virou a correção cirúrgica e "arredonda
  para cima em conta que decide gasto".
- **Preço lido em resumo de busca** (R$ 590) virou insumo de três contas e
  "o preço que apurei hoje"; o real era R$ 790 e o domínio estava morto.
  Virou `[SNIPPET]` que não entra em conta e o verbo "apurar" reservado.
- **Metade das 54 fontes era blog de quem vende o kit**, e a estatística de
  abertura veio de vendedor. Virou a tabela de classe de fonte na etapa 2.
- **Desconto de 9,81% sobre o custo** publicado como teto sobre o preço de
  venda. Virou "percentual carrega a base".
- **Tabela com 11 de 16 preços**, os cinco mais caros descartados sem
  declarar. Virou "amostra publicada é amostra coletada, ou declara o
  critério".
- **O mesmo defeito sobreviveu a quatro rodadas** porque cada rodada
  corrigia a ocorrência e não a classe. Virou "grep do valor antigo antes
  de fechar a rodada" e "corrija a classe".
- **Pauta passou o funil e só no dossiê se viu** que 8 de 10 resultados
  falavam com quem compra presente, não com quem produz. Virou o corte de
  destinatário na etapa 0.
- **Artigo tecnicamente sólido e surdo ao leitor**, porque ninguém leu o
  que o leitor escreve em fórum. Virou a seção de vocabulário do dossiê.
- **Abriu desqualificando o leitor** ("se você tem poste, off-grid é
  errado"). Virou a regra do réu: o réu é a regra genérica ou o vendedor,
  nunca quem está lendo.
- **Aplicar a skill `humanizer` crua** reintroduziria travessão e cortaria
  ressalva obrigatória. Virou `referencias/antipadroes.md`, calibrado para
  PT-BR e com o freio: em empate, deixa.
- **Espécime externo com todo número inventado tinha página melhor** (caixa
  de conclusões, panorama, FAQ). Virou a regra do slot: bloco só nasce se
  todo campo dele sai de número congelado.
- **Site 100% IA derrubado na atualização de spam de agosto de 2026**, e o
  dono atribuiu ao volume, não à IA; um pipeline 100% IA subiu na mesma
  semana. Virou a seção de ritmo e a regra 8.
- **Na validação desta skill (10/09/2026, dois sites de teste)**: o capítulo
  saiu com 25 travessões porque a etapa 4 não dizia nada e a 6 pagou a
  conta (virou regra de forma na etapa 4); a declaração de IA que
  `DECLARACOES.md` exige não tinha onde morar no `post.md` (virou a seção
  fixa "Como esta peça foi feita"); a norma federal só ficou legível
  baixando o PDF e extraindo o texto (virou a regra 10 da etapa 2); o
  status `publicado` no fim da etapa 7 mentia, porque não existe página
  (virou `pronto`); R$ 26,04 virou R$ 27 por "arredondamento sobe" (a
  regra passou a distinguir quantidade discreta de valor contínuo); e a
  troca de travessão por dois-pontos dentro do frontmatter quebrou o YAML
  (virou a validação de frontmatter na etapa 6). Medindo as duas peças
  depois: uma tinha 78% das frases acima de 20 palavras e 5% curtas, e
  nenhuma linkava a fonte no corpo, só na lista final. A régua "nenhuma
  frase acima de 45" não pegava isso; virou `scripts/medir-texto` nas
  etapas 5 e 6.
- **Segunda rodada (site de MEI, nota 9)**: o `medir-texto` descartava
  palavra de três letras e ignorava a query "mei das", que é o vocabulário
  inteiro do nicho (virou lista de palavras vazias em vez de tamanho);
  `titulo` com dois-pontos quebrava o YAML porque só `selo` tinha aviso
  (agora os três campos de texto vão entre aspas); e três capítulos com a
  mesma forma dentro da peça pareciam violar a regra 8, que é entre peças
  (a regra agora diz isso, e onde o bloco entra).
- **Terceira rodada (site de sublimação, nota 7 antes das correções)**: o
  exemplo da calculadora em `blocos.md` usava variáveis que não declarava
  (o exemplo agora é completo); o `medir-texto` somava as linhas `campo` e
  `saida` da calculadora como uma frase de 60 palavras (agora ignora as
  diretivas de dado); a revisão não tinha caminho para um número certo que
  só não virou D (agora acrescenta o D em append); três capítulos abriam
  com "X custa R$ Y" e o grep não viu (a leitura de aberturas virou passo
  obrigatório do passe 2); e o corte 2 da etapa 0 dizia "abra ou imagine"
  (agora abre, com orçamento).

## O que nunca fazer

- Escrever um número que não está no dossiê "porque é óbvio".
- Pular a etapa 1 porque o tema veio pronto. Tema de fora passa pelos
  mesmos cortes; o que muda é que ele entra na etapa 0 como candidata única.
- Rodar as oito etapas de uma vez em modelo pequeno.
- Abrir `sites/_modelo/` para responder qualquer coisa. É o molde.
- Criar pasta nova em `sites/<slug>/`. As cinco que existem bastam; se não
  bastarem, o lugar de mudar é este método, não a peça.
- Alterar `post.md` na etapa 6 sem registrar a correção em `revisao.md`.
- Trocar a data `atualizado` sem mudança de fato no texto.

## O diário da peça

`posts/<peça>/diario.md`, append-only, uma entrada por etapa executada
(inclusive etapa repetida: a segunda rodada de revisão é outra entrada).
Quem lê o diário sem abrir mais nada entende o caminho da peça: o que se
tentou, o que ficou de fora e por quê, o que foi empurrado para depois.

```markdown
# Diário — <slug da peça>

## 2026-09-12 · etapa 1 · pauta
**feito:** pauta fechada a partir da candidata 7 da rodada 2026-09-10;
slug reservado no CLUSTER.md.
**decidido:** planta explicativo (verbo "entender"). Alternativa
considerada: veredito, descartada porque o dossiê ainda não tem o dado
que decidiria "sim ou não".
**descartado:** cobrir o convencional de janela; vai para "o que esta
peça recusa" e para as candidatas como ideia própria.
**adiado:** comparação por marca, até existir a peça de seleção
(candidata 12).
**travou em:** nada.
**tempo:** ~15 min.

## 2026-09-12 · etapa 2 · dossiê
**feito:** 6 dados, 1 [SEM DADO] (consumo do convencional).
**decidido:** tese ajustada de "economiza X" para "custa X a mais e o
retorno não fecha com o dado que existe"; a versão nova está no dossiê.
**descartado:** três blogs de integrador como fonte (classe 4).
**adiado:** pedido de dado ao Inmetro por protocolo (dias); registrado
como "o que faria a tese fechar".
**travou em:** PDF da tabela do PBE ilegível por fetch; baixado e extraído.
**tempo:** ~50 min.
```

Os seis campos são fixos e aparecem sempre, mesmo com "nada". Tempo sem
cronômetro é estimativa declarada; nunca invente duração medida. Entrada
sem "descartado" e sem "adiado" em três etapas seguidas é sinal de que
alguém está decidindo sem registrar, não de que não houve escolha.

Os arquivos de trabalho continuam sendo a fonte do conteúdo: candidatas
guardam as ideias e o corte que as matou; a pauta guarda o que a peça
recusa; o dossiê guarda a tese ajustada; a revisão guarda cada rodada com
seu veredito. O diário não repete isso; aponta para lá e registra o que
nenhum deles registra: a escolha entre alternativas e o motivo.
