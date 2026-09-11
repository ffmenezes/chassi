# Quando cada bloco entra, pelo sinal do conteúdo

Usado na etapa 3, ao preencher o campo `bloco:` de cada capítulo. A lógica
é a mesma para todos: **o bloco é uma forma de apresentar algo que o
esqueleto já tem**; ele nunca cria conteúdo, e por isso o sinal que o chama
está no esqueleto, não no gosto de quem escreve. Cada linha diz o sinal, a
condição para o bloco nascer, e o "quando não". A sintaxe e as travas da
build estão em `blocos.md`.

## O orçamento

Antes da tabela, o teto. Peça é texto; bloco é pausa no texto. Muita pausa
e o leitor para de ler para olhar.

- **Um bloco de dado por capítulo** (tabela, gráfico, figura de prova,
  calculadora, citação de fonte). Dois sinais no mesmo capítulo: fica o que
  responde a pergunta do H2; o outro vira prosa ou muda de capítulo.
- **No máximo um bloco de cada família por peça**, salvo pilar: um
  gráfico, uma calculadora, um checklist, uma verificação, um deck de
  slides, um carrossel. Duas tabelas de panorama são normais; dois
  checklists são um checklist mal cortado.
- **Citação destacada: até duas por peça.** Aviso: até dois. Figura:
  quantas provas houver, mas prova, não enfeite.
- **Os fixos não contam**: abertura, conclusões, sumário, FAQ, fechamento,
  autor.
- A tabela dentro de `grafico`, em "Ver os números", faz parte do mesmo
  bloco. Não monte uma tabela separada e o gráfico no mesmo capítulo:
  os dados tabulados ficam dentro do gráfico e contam como um bloco só.
- Peça curta (quatro ou cinco capítulos): dois ou três blocos de corpo é o
  normal. Peça com um bloco em todo capítulo está decorada, não escrita.

## Dado

| sinal no esqueleto | bloco | condição | quando não |
|---|---|---|---|
| Três ou mais itens com os mesmos atributos (modelo × preço × consumo) | `tabela-panorama` (4) | toda célula sai de um D; coluna com célula sem dado perde a coluna; célula obrigatória sem dado é `[sem dado confiável]` | dois itens: é frase; um atributo só: é lista ou frase |
| Dois lados apurados na mesma base e data (antes × depois, A × B) | `tabela-contraste` (5) | as duas colunas vêm do mesmo método, mesma data; a coluna "medido" nunca contra "imaginado" | lado estimado contra lado medido: é prosa com a ressalva; mais de dois lados: panorama |
| Os dois sinais acima ao mesmo tempo (quatro marcas × dois preços) | `tabela-panorama` (4) | o desempate é a pergunta do H2: contraste responde "qual é a diferença entre A e B" e tem exatamente duas coisas comparadas; qualquer tabela com três ou mais linhas de itens é panorama, mesmo com duas colunas de valor | |
| Panorama de três ou mais categorias na mesma unidade, série no tempo com três ou mais pontos, ou partes de um todo | `grafico` (31) | os números são os da tabela do mesmo capítulo; um por peça; ver `blocos.md`, "Quando a tabela vira gráfico" | dois valores; capítulo que já tem figura de prova ou calculadora |
| Uma conta que o texto fez por extenso e cujo resultado muda com o caso do leitor (kWh × tarifa × horas) | `calculadora` (23) | a conta já está no corpo, com os valores de partida do esqueleto; todo campo tem `origem`; sem projeção de faturamento | conta com uma variável só: é uma frase com a regra de três; capítulo que já tem gráfico |
| Print, foto ou medição que **prova** um número do texto | `figura` (19) papel `prova` | legenda diz o que o leitor vê; fonte e data; o número aparece também no texto | imagem "para ilustrar": é `spot`, e spot só se `ILUSTRACAO.md` pede |
| Relação entre partes que a prosa levaria três parágrafos para descrever (fluxo, esquema, antes/depois de um sistema) | `figura` (19) papel `diagrama`, SVG inline | legenda, fonte e data; `<desc>` com os números; nada só por cor | o esquema cabe em uma lista ordenada: é lista |
| Frase literal de pessoa nomeada, com cargo, que sustenta ou contradiz o texto | `citacao-fonte` (7) | a frase está no dossiê com URL; `conflito` declarado; a citação não é origem de número | "especialistas dizem": não existe; frase de blog: não é fonte |

## Sequência e procedimento

| sinal no esqueleto | bloco | condição | quando não |
|---|---|---|---|
| Ações em ordem, cada uma com um "você vai ver X" | `passos` (27) | cada passo tem resumo curto e detalhe; ordem real, não enumeração | lista de coisas sem ordem: é lista; um passo só: é frase |
| Comando, trecho de configuração ou texto que o leitor cola | `codigo` (20) | rótulo diz onde roda; nenhuma linha começa com `$ `, `# ` ou `> `; `aviso` se altera estado | número ou nome de produto: não é código; "exemplo de e-mail" em prosa: é citação, não código |
| O que ter em mãos antes de começar, ou o que conferir no fim | `checklist` (8) | **recapitula** o que o capítulo já provou; item verificável com sim ou não; até 7 | item que introduz informação nova: é `verificacao`; lista de compras sem verificação: é lista |
| Auditoria contra um critério que o leitor ainda não viu (o produto atende a norma? o plano cobre X?) | `verificacao` (28) | três estados (atendido, parcial, não atendido), `parcial` e `não atendido` com nota; critério nomeado | item sim/não que o texto já explicou: é checklist |

## Ênfase e ressalva

| sinal no esqueleto | bloco | condição | quando não |
|---|---|---|---|
| A conclusão nossa que o leitor levaria se lesse uma frase só | `citacao` (6) | é conclusão do texto, com o número; até duas por peça | frase de efeito, aforismo, frase de terceiro |
| Consequência que o leitor não desfaz (choque, multa, perda de garantia, dado apagado) | `aviso` (21) `atencao` | fonte com norma, manual ou lei, e data; até dois por peça | "importante", "dica", urgência comercial: não é aviso; ressalva de número: fica colada ao número, em prosa |
| Observação lateral que muda o caso de alguns leitores (regra municipal, versão antiga) | `aviso` (21) `nota` | uma ou duas frases; sem fonte obrigatória | ressalva de todo número: é prosa |

## Mídia e sequência visual

| sinal no esqueleto | bloco | condição | quando não |
|---|---|---|---|
| Uma sequência que precisa ser vista **um de cada vez**, com título por etapa (telas de um app, fases de uma montagem) | `slides` (29) | 2 a 10 slides, cada um com título e parágrafo ou figura; um por peça | o leitor precisa comparar as etapas lado a lado: é carrossel ou tabela |
| Vários itens que precisam ser vistos **lado a lado**, com legenda cada (prateleira de modelos, variações) | `carrossel` (13) | cada legenda funciona sozinha; não entra no schema | itens com números comparáveis: é tabela; um item: é figura |
| Post público de rede social que é fonte (o fabricante anunciou, o órgão comunicou) | `card-rede-social` (14) | texto citado fora do embed; autor, handle e data; nota do conflito | print de comentário anônimo: vai para "o que o leitor diz" no dossiê, sem nome, em prosa |

## Pergunta e conversa

| sinal no esqueleto | bloco | condição | quando não |
|---|---|---|---|
| Três a seis perguntas literais do leitor (dossiê, "também perguntam") que o corpo não responde na ordem em que ele as faz | `faq` (9) | resposta em 50 a 100 palavras; a que repete capítulo aponta para ele | pergunta inventada para caber palavra-chave; FAQ com uma pergunta |
| Diagnóstico por faixa ("qual BTU para o seu quarto") ou prova com gabarito e fonte | `quiz` (30) | faixas sem buraco e sem sobreposição; gabarito com o porquê e a fonte com ano; um por peça | perguntas de opinião; resultado que exige e-mail |
| Voto do leitor sobre algo que o texto não decide | `enquete` (11) | ainda `previsto` (sem endpoint): entra inerte e visível | qualquer coisa que o texto já responde |

## Como aplicar na etapa 3

1. Leia a `resposta:` e os `dados:` do capítulo. O sinal está neles: três
   itens com atributos, dois lados na mesma base, ações em ordem, frase
   literal de pessoa, consequência irreversível.
2. Ache a linha da tabela. Sem linha: o capítulo é prosa, e prosa é o
   padrão, não a falta de um bloco.
3. Confira a condição. Falhou (célula sem D, passo sem verificação,
   citação sem URL): o bloco não nasce, e o esqueleto anota por quê no
   campo `não entra:`.
4. Confira o orçamento. Estourou: fica o bloco que responde o H2.
5. Escreva no campo `bloco:` o nome da diretiva, como em `blocos.md`. É
   isso que a etapa 4 copia e a etapa 5 confere.
6. Confira se o site declara o bloco em `blocos` de
   `web/src/sites/<slug>.ts`. Não declara: acrescente (a régua de conteúdo
   manda, não o molde do `exemplo.ts`) e anote no diário.
