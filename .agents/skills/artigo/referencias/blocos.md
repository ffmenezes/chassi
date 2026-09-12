# Blocos — a sintaxe no `post.md` e o que a build cobra

A autoridade sobre cada bloco é o comentário de cabeçalho do seu `.astro`
em `web/src/components/blocos/` e o resumo em `web/src/catalogo.ts`. Esta
página só traduz isso para quem escreve markdown: como marcar um bloco na
prosa, quais campos ele exige, e o que derruba a build.

## O contrato provisório

O encanamento `post.md → blocos` ainda não existe. A sintaxe abaixo é o
contrato que ele vai honrar: **diretivas de contêiner** (`:::nome{atributos}`
até `:::`), o mesmo formato que `remark-directive` lê. Escrever nela hoje
custa nada e evita reescrever peça quando o parser chegar. Até lá, o texto
dentro das diretivas é markdown legível por gente.

```markdown
:::nome-do-bloco{atributo="valor" outro="valor"}
conteúdo em markdown
:::
```

Regras gerais:

- Um bloco por diretiva; diretiva não aninha diretiva.
- Atributo com espaço vai entre aspas duplas. Aspas duplas dentro do
  valor: use aspas simples no valor.
- O nome é o da tabela abaixo, sempre em minúsculas com hífen.
- Bloco que não está em `blocos` de `web/src/sites/<slug>.ts` não nasce na
  página. A etapa 3 confere antes de listar; a etapa 7 confere de novo.

## O arquivo `post.md`

```markdown
---
titulo: "<menos de 60 caracteres>"
descricao: "<150 a 160 caracteres>"
slug: <igual ao nome da pasta e à linha do CLUSTER.md>
publicado: AAAA-MM-DD
atualizado: AAAA-MM-DD
minutos: <inteiro>
selo: "<categoria curta>"
---

:::abertura
cena: ...
problema: ...
:::

:::conclusoes{rotulo="O essencial em 4 pontos"}
- ... **dado verificável: número, condição ou regra** ... (ressalva no fim)
:::

## H2 ...
prosa, blocos de corpo, H3 quando precisar

:::faq
### pergunta
resposta
:::

:::fechamento
parágrafos
:::

## Fontes
- lista

## Como esta peça foi feita
dado próprio (o quê, quando, como), declarações de base/DECLARACOES.md,
quando os números vencem
```

`titulo`, `descricao` e `selo` vão **sempre entre aspas duplas**: é YAML,
e dois-pontos, `#` ou aspas dentro do valor quebram o parser sem aviso
legível. Aspas dentro do valor viram aspas simples. Datas em
`AAAA-MM-DD`, dia de calendário, sem hora e sem fuso: é assim
que `web/src/data.ts` formata sem o bug do dia 1º virar o mês anterior.
`titulo`, `descricao`, `atualizado` e `selo` alimentam o cabeçalho, o card
da grade (N2) e o card social; título vazio quebra a build do card.

O **sumário (bloco 3)** e o **autor (bloco 22)** nunca são escritos: o
sumário nasce dos H2 (quatro ou mais, ou não nasce). A fonte editorial do
autor é `base/AUTOR.md`, mas o componente recebe hoje um objeto `Autor`:
a leitura automática desse arquivo ainda não existe. "Fontes" e "Como
esta peça foi feita" são as duas seções fixas depois do fechamento; o
contrato do futuro parser as trata como rodapé da peça, não como
capítulo, e elas não contam para o sumário.

## Os blocos de corpo

Estado: **montável** = a página de artigo já renderiza; **catálogo** =
existe como componente mas a página ainda não o monta, e a peça pode usar
sabendo que fica como prosa até o encanamento chegar.

| nome | # | estado | campos | o que derruba a build ou impede o bloco |
|---|---|---|---|---|
| `abertura` | 1 | montável (fixo) | `cena`, `problema` | nada em código; editorial: problema até a segunda frase |
| `conclusoes` | 2 | montável (fixo) | `rotulo?`; itens com dado verificável em negrito e ressalva | nada em código; editorial: dado ou lacuna explícita e ressalva em todo item, sem numeral decorativo |
| `tabela-panorama` | 4 | montável | `fonte?`; tabela markdown; célula sem dado escrita `[sem dado confiável]` | nada em código; editorial: coluna só existe se todas as células saem do esqueleto |
| `tabela-contraste` | 5 | montável | idem, duas colunas apuradas na mesma base e data | idem |
| `grafico` | 31 | montável | `tipo` (barra, linha, pizza), `titulo` com unidade, `fonte` com data; tabela markdown dentro: primeira coluna é a categoria, as outras são as séries; `unidade?`, `decimais?` | **quebra**: sem título; sem fonte; série com contagem diferente das categorias; valor que não é número (lacuna é célula vazia, nunca zero); mais de 12 categorias; mais de 4 séries; linha com menos de 3 pontos; pizza com mais de uma série, mais de 6 fatias, lacuna ou negativo. Editorial: um por peça, e só onde a tabela já existe |
| `citacao` | 6 | montável | texto | teto editorial de 2 por peça; é conclusão **nossa**, nunca de terceiro |
| `citacao-fonte` | 7 | montável | `nome`, `papel`, `conflito` (todos obrigatórios); texto literal | tipo: sem `conflito` o `astro check` falha. Citação não é origem de número |
| `checklist` | 8 | montável | `rotulo?`; itens `- [ ] **forte** resto`, até 7 | corta em 7; recapitula, nunca introduz |
| `faq` | 9 | montável (fixo) | `### pergunta` + resposta, 3 a 8 | nada em código |
| `fechamento` | 10 | montável (fixo) | parágrafos | nada em código; retoma o problema da abertura |
| `figura` | 19 | montável | `papel` (prova, diagrama, spot), `alt`, `legenda`, `fonte`, `src?`, `largura?`, `altura?`, `pendencia?` | **quebra**: alt vazio; alt igual à legenda; prova ou diagrama sem legenda ou sem fonte; `src` que não existe no acervo; `largura`/`altura` diferentes do arquivo; SVG por `src`. Sem `src` sai marcador de prévia (legítimo) |
| `codigo` | 20 | montável | `rotulo` (obrigatório), `aviso?`; bloco de código dentro | **quebra**: rótulo vazio; linha começando com `$ `, `# ` ou `> ` |
| `aviso` | 21 | montável | `tipo` (atencao, nota), `titulo`, `fonte?`; texto | **quebra**: `atencao` sem `fonte`. Editorial: só risco que o leitor não desfaz; nunca urgência comercial |
| `slides` | 29 | montável | `rotulo?`; `### título` por slide, 2 a 10, com parágrafo ou figura | **quebra**: fora de 2 a 10; slide sem título; título igual a alt ou legenda |
| `calculadora` | 23 | catálogo | `id`, `titulo`, `descricao`, campos com `origem`, saídas com `expr` | **quebra**: campo sem `origem`, `expr` com variável desconhecida, sem saída. A conta existe por extenso no corpo antes |
| `passos` | 27 | catálogo | `rotulo?`; itens `- **resumo** detalhe` | nada em código |
| `verificacao` | 28 | catálogo | itens com `item`, `criterio`, `estado`, `importancia`, `nota?` | **quebra**: `parcial` ou `nao-atendido` sem `nota` |
| `quiz` | 30 | catálogo | ver `web/src/quiz.ts` | **quebra** em dez situações; não use sem ler o arquivo |
| `carrossel` | 13 | catálogo | `rotulo?`; `### título` por item, com legenda e figura opcional | nada em código; editorial: cada legenda funciona sozinha; não entra no schema |
| `card-rede-social` | 14 | catálogo | `autor`, `handle`, `data`, `nota` (o conflito); texto citado | nada em código; editorial: o texto citado fica fora do embed, para o crawler |
| `enquete` | 11 | catálogo, `previsto` | `pergunta`, `piso`; opções em lista | sem endpoint `/api/enquete`: nasce inerte e visível |

Blocos 12, 15 a 18 e 24 a 26 são de avaliação, derivados, distribuição ou
conversão, e não entram na peça pelo método; a página os monta por conta
própria quando o site os declara. Qual bloco cabe em qual conteúdo, e o
orçamento por peça, está em `quando-cada-bloco.md`.

### Exemplos

````markdown
:::figura{papel="prova" alt="Painel do medidor mostrando 1,2 kWh após oito horas" legenda="Consumo registrado na noite de 9 de setembro de 2026" fonte="Medição própria, 2026-09-09" pendencia="print em pesquisa/<peça>/medidor.png, ainda fora do acervo"}
:::

:::codigo{rotulo="Terminal, na pasta web/"}
```bash
npm run build
```
:::

:::aviso{tipo="atencao" titulo="Desligue o disjuntor antes de abrir o painel" fonte="NBR 5410, item 6.3, 2004"}
Abrir a caixa com o circuito energizado é choque, não risco de multa.
:::

:::citacao-fonte{nome="Nome Sobrenome" papel="engenheiro da distribuidora X" conflito="a empresa vende o serviço que ele descreve"}
"frase literal, com a fonte no dossiê"
:::

:::checklist{rotulo="Antes de ligar"}
- [ ] **Disjuntor** dedicado, na corrente do manual
- [ ] **Dreno** com queda para fora
:::

:::grafico{tipo="barra" titulo="Preço à vista por modelo, R$" unidade="R$" fonte="Preço apurado em duas lojas, 10/09/2026"}
| modelo | Loja A | Loja B |
|---|---|---|
| Consul 9.000 inverter | 2999 | 3149 |
| Springer 9.000 convencional | 1389,90 | |
:::
````

A `calculadora` (23) escreve a conta como dado, uma linha por campo e por
saída, nesta forma (os `|` separam os campos; o que vem depois do valor de
partida é a origem, obrigatória):

````markdown
:::calculadora{id="empate" titulo="<o que a conta responde>" descricao="<uma frase>" ancora="#<id do H2 onde a conta está por extenso>"}
campo preco_inv | Preço do inverter | R$ | 2999 | loja A, à vista, 10/09/2026 (D3)
campo preco_conv | Preço do convencional | R$ | 1389.90 | loja B, Pix, 10/09/2026 (D4)
campo kwh_inv | Consumo mensal do inverter | kWh | 33 | ficha técnica, 396 kWh/ano ÷ 12 (D2)
campo kwh_conv | Consumo mensal do convencional | kWh | 50 | PREMISSA DE EXEMPLO, sem fonte: troque pela etiqueta Inmetro (D7)
campo tarifa | Tarifa por kWh | R$ | 0.789 | Enel SP, B1, sem impostos, set/2026 (D1)
saida diferenca | Diferença de preço | R$ | preco_inv - preco_conv | casas: 2
saida economia_mes | Economia por mês | R$ | (kwh_conv - kwh_inv) * tarifa | casas: 2 | ressalva: sem impostos nem bandeira
saida meses | Meses até empatar | meses | diferenca / economia_mes | casas: 0 | arredonda: cima
:::
````

`campo id | rótulo | unidade | valor de partida | origem`; `saida id |
rótulo | unidade | expressão | opções`. A expressão usa só `+ - * /`,
parênteses e os ids de campos e saídas anteriores, **todos declarados no
mesmo bloco** (id que não existe quebra a build); é a mesma conta que o
capítulo faz por extenso, e `ancora` aponta para ela. Valor de partida sem
D é premissa, e a origem diz isso com a palavra PREMISSA e onde o leitor
pega o valor real.

No `grafico`, a tabela markdown é a fonte dos números: primeira coluna são
as categorias (barras, pontos da linha ou fatias), cada coluna seguinte é
uma série. Célula vazia é lacuna declarada e sai como "[sem dado]", nunca
como zero. Os números vêm da comparação congelada no esqueleto: o gráfico
é a tabela desenhada, e a tabela viaja dentro dele, em "Ver os números".
Não repita uma tabela-panorama ou tabela-contraste separada com os mesmos
dados: gráfico e tabela embutida contam como um bloco de dado no orçamento.

## Quando a tabela vira gráfico, e quando não

(O mesmo raciocínio para todos os blocos, com o orçamento por peça, está em
`quando-cada-bloco.md`; esta seção é o caso do gráfico, que foi o primeiro
a ganhar régua.)

O gráfico existe para uma pergunta que a tabela responde devagar: "qual é o
maior", "isso subiu ou caiu", "que parte do todo é". Ele nunca substitui a
tabela nem o texto; acrescenta uma leitura de um olhar. Por isso a régua é
apertada, e é a etapa 3 que decide, no campo `bloco:` do capítulo:

| a comparação é | forma | condição |
|---|---|---|
| três ou mais categorias na mesma unidade ("preço por modelo") | `barra` | os valores são do esqueleto, com D; lacuna fica como lacuna |
| um valor ao longo de uma sequência (meses, faixas de consumo, anos) | `linha` | três pontos ou mais; menos que isso é contraste, não tendência |
| partes de um todo que somam 100% ("de onde vem a conta") | `pizza` | até seis fatias, nenhuma lacuna; se as partes não somam o todo, é barra |

E quando **não**:

- Dois valores ("inverter contra convencional") são uma frase ou a tabela
  de contraste, não um gráfico: o leitor compara dois números de cabeça.
- Um gráfico por peça é o teto normal; o segundo só em pilar, e nunca dois
  da mesma forma para a mesma pergunta.
- Gráfico não entra em capítulo que já tem figura de prova ou calculadora:
  três blocos de dado no mesmo capítulo é sobrecarga, e o leitor para de
  ler para olhar.
- Número que não está no esqueleto não entra no gráfico "para completar a
  série". Lacuna declarada é melhor que barra inventada.
- O título do gráfico diz o que ele mede, com a unidade; nunca repete o H2
  nem promete conclusão ("o inverter vence"). A conclusão é do texto.

## Calculadora e gráfico juntos: ainda não

O que o bloco 31 não faz, e o 23 também não: um gráfico que redesenha com os
campos da calculadora (o custo acumulado de dois aparelhos ao longo dos anos,
cruzando no mês do empate). O 31 é SVG gerado na build; o 23 recalcula
número, não desenho. Peça que precisa disso hoje usa a calculadora, e a
ideia fica registrada aqui como bloco acoplado a criar (23 + 31), pela
skill `criar-componente`.

## Imagens: onde ficam, hoje

`src` da figura só aceita arquivo raster do acervo `web/src/imagens/`, que
é do upstream. Onde a imagem do participante vai morar ainda não foi
decidido (AGENTS.md). Até lá: a imagem fica em
`sites/<slug>/pesquisa/<peça>/`, a figura entra sem `src` e com
`pendencia` dizendo o arquivo, e a etapa 7 lista a pendência. A build
aceita figura sem `src` como marcador de prévia.

## O que a build cobra da peça inteira

- Quatro ou mais H2, ou o sumário não nasce.
- `titulo` não vazio (card social), `dominio` do site só host.
- `atualizado` em `AAAA-MM-DD`.
- Objeto `Autor` válido (nome com sobrenome, não coletivo, sem
  `[DEFINIR]`, foto e `sameAs` declarado), ou o bloco 22 não nasce.
  A etapa 7 confere a ficha `base/AUTOR.md` manualmente; uma build verde
  dos mocks não valida essa ficha nem verifica se a foto é real.
- `posts/<peça>/comentarios.json`, se existir, válido e com `versao: 1`.
  A peça não escreve esse arquivo; a moderação escreve.
- Todo bloco usado declarado em `blocos` do `web/src/sites/<slug>.ts`.
