# Rabisco — DESIGN.md

Caneta esferográfica azul em caderno pautado, com marca-texto amarelo e a
caneta vermelha do professor. Scrapbook por cima: folha colada, contorno
passado duas vezes, nada perfeitamente reto.

- **Referência:** rabisco.net (Distrito Rabisco, jogo de tiro em primeira
  pessoa desenhado como rabisco de caderno). Todo valor abaixo foi medido no
  CSS publicado do site (variáveis de `:root` e regras computadas), não
  estimado de captura de tela.
- **Implementação no chassi:** `web/src/styles/estilos/rabisco.{css,ts}`, com
  a letra auto-hospedada em `web/src/styles/estilos/fontes/patrick-hand/`.
- **Nomes de busca do estilo:** *ballpoint pen doodle*, *sketchbook UI*,
  *notebook doodle*, *hatching / cross-hatching*, *scrapbook UI*,
  *hand-drawn wobbly UI*. Parente de jogo: *Doodle Jump*. Parente de
  ferramenta: Excalidraw e rough.js, só que em CSS puro.

---

## 1. Atmosfera

Um caderno escolar aberto em que alguém desenhou com uma Bic azul. O papel é
morno, nunca branco; a tinta é azul, nunca preta. O amarelo aparece onde uma
pessoa passaria marca-texto: no que é para clicar, no que está selecionado,
embaixo do título. O vermelho é raro e tem dono: a margem do caderno e a
correção.

A imperfeição é **medida**, não aleatória: cantos com quatro raios diferentes,
giros de meio grau, contorno repetido deslocado alguns pixels. Passou de 1,5°
vira bagunça; abaixo de 0,3° ninguém vê.

## 2. Paleta e papéis

### Referência (medida no rabisco.net)

| Papel | Variável lá | Valor |
|---|---|---|
| Papel da página | `--paper` | `#f6f3e6` |
| Folha avulsa | `--paper-2` | `#fcfaf2` |
| Cartão | `--card` | `#fffdf7` |
| Tinta (geral) | `--ink` | `#263e8e` |
| Tinta (home, mais viva) | `--ink` no escopo da home | `#1018ad` |
| Tinta apagada | `--muted` | `#586581` / `#242f91` |
| Linha fina | `--line` | `#263e8e29` (16%) |
| Linha média | `--line-2` | `#263e8e50` (31%) |
| Caneta vermelha | `--red` | `#be3a3c` |
| Foco | literal | `#b82030`, `3px dashed` |
| Marca-texto | `--marker` | `#ffcf23` (home) / `#f2ce65` |
| Hachura do marca-texto | literal | `#ffcd27`, `#ffe987`, `#ffd434` |
| Contorno do selecionado | literal | `#f6b807` / `#efb207` |
| Fita crepe | literal | `#e1d6bd` |
| Pauta | `--paper-rules` | `#496abb` a 7%, 1px a cada 28px |
| Margem | `#loading:before` | `--red`, 2px, opacidade 0,45, a 7,2% da esquerda |

Os objetos 3D do jogo usam mais três "canetas do estojo": laranja, verde e
rosa, sempre como contorno com hachura, nunca preenchimento chapado.

### Chassi, modo claro

| Token | Valor | Contraste |
|---|---|---|
| `--b-fundo` | `#f6f3e6` | — |
| `--b-superficie` | `#fcfaf2` | — |
| `--b-tinta` (título) | `#1018ad` | 10,75:1 no fundo |
| `--b-corpo` | `#263e8e` | 8,73:1 no fundo |
| `--b-tinta-2` | `#586581` | 5,25:1 no fundo |
| `--b-linha` | `rgba(38,62,142,.2)` | decorativa |
| `--b-linha-forte` | `rgba(38,62,142,.62)` | 3,36:1 (borda de campo) |
| `--b-acento` | `#ffcf23` | preenchimento, nunca texto |
| `--b-acento-forte` | `#f6b807` | hover |
| `--b-acento-tinta` | `#b3303a` | 5,55:1 no fundo |
| `--b-acento-fraco` | `#fff1b0` | fundo de código inline |
| `--b-sobre-acento` | `#1018ad` | 8,09:1 no acento, 6,71:1 no forte |
| `--b-erro` | `#a01830` | 7,08:1 no fundo |
| `--b-grafico-1..4` | `#1018ad` `#b3303a` `#2f8a3a` `#b05e00` | todas ≥ 3:1 na superfície |

### Chassi, modo escuro (derivação declarada)

A referência não tem modo escuro. Ele sai do mapa **NIGHT** do próprio jogo:
prédios hachurados em azul-noite, janelas e lua em amarelo.

| Token | Valor | Contraste |
|---|---|---|
| `--b-fundo` | `#121634` | — |
| `--b-superficie` | `#1b2048` | — |
| `--b-tinta` | `#f6f1d8` (caneta gel creme) | 15,54:1 |
| `--b-corpo` | `#e2ddc6` | 12,93:1 |
| `--b-tinta-2` | `#a9aed0` | 8,11:1 |
| `--b-acento` | `#ffcf23` (não muda: é a lua) | — |
| `--b-acento-tinta` | `#ff8f7a` (gel coral) | 7,95:1 |
| `--b-sobre-acento` | `#121634` | 11,93:1 |
| `--b-erro` | `#ff9b9b` | 8,75:1 |

Todo par de texto passa de 4,5:1 e toda peça de interface passa de 3:1, nos
dois modos. O cálculo é a luminância relativa do WCAG.

## 3. Tipografia

| Uso na referência | Família | Detalhe medido |
|---|---|---|
| Interface inteira, títulos de mapa | **Patrick Hand** | 400; o título do mapa sai em 700 sintetizado mais `-webkit-text-stroke: 1px` |
| Anotação, balão, legenda | **Caveat** | 600 |
| Título de painel ("WAVE 1") | **Bungee** | 400, `letter-spacing: -1px` |
| Números do jogo (pontuação, onda) | **VT323** | monoespaçada de fliperama |
| Logo | desenho, não fonte | letras de bloco hachuradas com risco de marca-texto |

**No chassi:** Patrick Hand nos três papéis (`titulo`, `corpo`, `meta`), como
na referência. O código continua monoespaçado do sistema, porque código é
mono por semântica.

- **Por que o corpo também é manuscrito:** foi escolha do dono. Patrick Hand é
  a manuscrita mais legível do grupo (letra de forma, sem ligadura cursiva).
  Artigo muito longo cansa mais do que em sans, e esse é o custo aceito.
- **Peso de título 700:** a Patrick Hand só tem o 400; o 700 é sintetizado
  pelo navegador. É o que a referência faz, e lê como caneta passada duas
  vezes.
- **Altura-x compensada:** a Patrick Hand mede 0,467 de altura-x (467 em 1000
  unidades, lido no arquivo). Os blocos foram medidos em px para uma sans do
  sistema, perto de 0,52. `font-size-adjust: .5` no contêiner do estilo iguala
  isso sem tocar em nenhum bloco.
- **Rótulo:** caixa alta, `letter-spacing: .08em` (a referência usa 1–2px em
  17px).
- **Ficaram de fora, e por quê:** Caveat não tem papel no contrato (não há
  token de "anotação", e em 11px de meta ela é ilegível). Bungee é de letreiro,
  alto demais para título de artigo. VT323 serviria como código, mas é pixel e
  pequena demais nos tamanhos dos blocos.
- **Hospedagem:** woff2 próprio, recortes latino e latino estendido com os
  mesmos `unicode-range` do Google. Sem requisição a terceiro. Licença OFL em
  `fontes/patrick-hand/OFL.txt`.

## 4. A receita de forma

Cada técnica da referência, e onde ela mora no chassi.

| Técnica na referência | Como é lá | No chassi |
|---|---|---|
| Canto torto | `border-radius: 5px 8px 3px 6px` e variações | `--b-radius: 6px 10px 5px 8px / 8px 5px 10px 6px` |
| Contorno passado duas vezes | `::before` com segunda borda deslocada e girada 1° | **aproximado** por `--b-sombra`: sombra na cor da superfície, encolhida 1,5px, sobre sombra na cor da tinta. Sobra o contorno de uma "folha de trás" |
| Nada é reto | `rotate(-.45deg)` / `rotate(.35deg)` alternados | `--b-giro: -.4deg`, `--b-giro-par: .3deg` (token novo) |
| Hover que sobe e entorta | `translateY(-3px) rotate(-1.4deg)` | `--b-lift: translate(-1px,-2px) rotate(-.6deg)` |
| Marca-texto hachurado | `repeating-linear-gradient(137deg, …)` em 3 amarelos | `--b-acento-preenchimento` (token novo) |
| Risco sob o título | `::after` hachurado de 7px, girado -2° | `--b-titulo-grifo`: sublinhado de .34em com recuo -.2em (token novo) |
| Foco circulado | `outline: 3px dashed #b82030` | `--b-foco-traco: dashed` (token novo), cor de `--b-acento-tinta` |
| Sombra chapada | `3px 3px 0 var(--ink)`, sem desfoque | idem, dentro de `--b-sombra` |
| Papel pautado | gradiente de 28px + margem vermelha | `--b-aurora` no contêiner do estilo |
| Fibra do papel | `paper-fiber.webp`, 256×28 | ruído SVG (`feTurbulence`) em `data:`, uma cor por modo |
| Traço trêmulo | desenho feito à mão | `--b-grafico-tremor`: deslocamento SVG no gráfico (bloco 31) |
| Seleção de texto | — | `::selection` em marca-texto (acréscimo nosso) |
| Lista | — | travessão (`"– "`) e numeração `1)` via `@counter-style` |

### O que a referência tem e o chassi não reproduz

- **Fita crepe** (`clip-path` serrilhado, textura em `multiply`, girada -23° e
  -48°) e **papel rasgado** (`clip-path` de 46 pontos). Exigem
  pseudo-elemento dentro do bloco; estilo não escreve seletor em bloco.
- **Ilustração recortada com `mix-blend-mode: multiply`**, que faz o branco
  da imagem sumir no papel. Precisaria de token na figura; fica para quando
  houver imagem própria do participante.
- **Animação ociosa** (personagens balançando, painel entrando em
  `steps(4)`, como stop-motion). Blog não tem personagem.
- **Contorno duplo girado de verdade.** A sombra dá a folha de trás, mas não
  gira independente da peça.

## 5. Profundidade

Não há desfoque em lugar nenhum. Profundidade é **folha sobre folha**:

- repouso: `3px 4px 0 -1.5px superfície, 3px 4px 0 0 tinta a 50%`
- hover: a folha de trás se afasta para `5px 6px`, e a peça sobe e entorta

## 6. Faça e não faça

**Faça**
- Mantenha tudo em azul. Preto quebra o caderno.
- Use o amarelo só como preenchimento (botão, página atual, grifo, seleção).
- Mantenha giros entre 0,3° e 0,6°. Ímpar para um lado, par para o outro.
- Deixe a pauta quase invisível (9% de opacidade). Ela é textura, não grade.

**Não faça**
- Amarelo como cor de texto: sai a 1,3:1 sobre o papel.
- Vermelho como decoração: ele é margem, link, foco e erro, e só.
- Giro acima de 1,5° ou em tabela e código: tira a leitura.
- Caveat em texto pequeno: abaixo de 16px ela vira rabisco de verdade.

## 7. Guia para agente

> Estilo "rabisco": caderno pautado (papel `#f6f3e6`, pauta azul `#496abb` a
> 9% a cada 28px, margem vermelha de 2px), tudo escrito em caneta Bic azul
> (`#1018ad` título, `#263e8e` corpo) na letra Patrick Hand. Marca-texto
> `#ffcf23` hachurado a 137° só em botão, item selecionado e grifo de título.
> Caneta vermelha `#b3303a` para link e foco tracejado. Cantos com quatro
> raios diferentes, peças giradas ±0,4°, sombra sem desfoque desenhando o
> contorno de uma folha atrás. Nada de preto, nada de blur, nada reto.

## 8. Limites conhecidos

- **Card social:** ele desenha o rodapé na cor `acento` do `rabisco.ts` sobre
  fundo claro fixo. Por isso o `acento` do `.ts` é o azul `#1018ad`, e não o
  amarelo do CSS. `circuito` (`#bbf451`) e `vidro` (`#00e5cc`) hoje saem com
  esse rodapé quase ilegível no card claro.
- **Diagrama com `fill: var(--b-acento)`:** a barra amarela fica a 1,3:1 do
  papel. Diagrama próprio deve usar as cores de `--b-grafico-*`.
- **Filtro SVG externo** (`--b-grafico-tremor`) não aplica no Safari; o
  gráfico sai reto, como em qualquer estilo sem o token.
