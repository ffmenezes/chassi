# _modelo

Este é o esqueleto de um site novo — pastas e stubs que espelham a doutrina de
site da holding, preenchidos como **perguntas** em vez de regras prontas.
Copie esta pasta, renomeie para o slug do seu site, e responda os stubs na
ordem abaixo.

> Nenhuma regra mora neste README. Cada arquivo em `base/` e `estado/` é dono
> único do seu domínio — por isso não existe precedência a resolver aqui: para
> saber a resposta de um domínio, vá direto ao arquivo dono dele, nunca a este
> índice.

## O que a build lê daqui, e o que não

`sites/<slug>/` é o que **você** consulta antes de escrever — e o que uma
ferramenta de conteúdo consultaria no seu lugar. O que a máquina lê para
montar o site é `web/src/sites/<slug>.ts`, e só ele.

A build abre **um** arquivo desta pasta, e um só:
`posts/<slug-da-peça>/comentarios.json`, que o bloco 18 assa no HTML — o
caminho está fixo em `web/src/comentarios.ts`, e JSON inválido ali derruba a
build. As regras estão em [`posts/README.md`](posts/README.md).

Todo o resto — `base/`, `estado/`, `pautas/`, `pesquisa/` — é insumo humano.
A consequência prática: errar um desses não quebra a build. Quebra o site —
devagar, em forma de texto bem escrito para ninguém. O erro que a build pega
é o do outro lado (estilo inexistente, mais de 6 tokens desviados); o erro
que só o leitor pega é o daqui.

O slug desta pasta e o do `web/src/sites/<slug>.ts` são o mesmo de propósito,
para dar para ir de um lado ao outro sem índice. Nenhuma validação cruza os
dois, então é você que mantém os dois iguais.

## Como começar

```bash
cp -r sites/_modelo sites/<seu-slug>
cp web/src/sites/exemplo.ts web/src/sites/<seu-slug>.ts   # o par do outro lado
```

Depois responda os stubs na ordem da tabela, apagando as perguntas conforme
as respostas ficam de pé. Não responda nada dentro de `sites/_modelo/`: veja
[Este diretório e o `scripts/atualizar`](#este-diretório-e-o-scriptsatualizar).

## Índice — pergunta → arquivo

**A fundação.** Sem estes três, o resto é decoração: eles decidem sobre o
quê, para quem e por quê.

| Pergunta | Arquivo |
|---|---|
| Sobre o que é este site, e o que ele recusa cobrir? | `base/TERRITORIO.md` |
| Quem lê, o que já tentou, o que digita no Google? | `base/LEITOR.md` |
| Por que este site existe, o que seria fracasso? | `base/META.md` |

**A voz e a assinatura.** Quem fala, como soa, de que lugar.

| Pergunta | Arquivo |
|---|---|
| Como o texto soa? | `base/TOM.md` |
| De que lugar o texto fala, em cada tipo de peça? | `base/POSTURAS.md` |
| Quem assina, com que autoridade? | `base/AUTOR.md` |

**O negócio, o material e a cara.** Como se sustenta, contra quem, com que
apuração, com que aparência.

| Pergunta | Arquivo |
|---|---|
| Como o site se sustenta, o que ele nunca vende? | `base/MONETIZACAO.md` |
| Quem já ocupa o espaço, o que fazem mal? | `base/CONCORRENTES.md` |
| Que fontes primárias existem no nicho? (fonte, não regra) | `base/PROVAS.md` |
| O que o leitor levaria em troca do e-mail? | `base/ISCAS.md` |
| Como as imagens se parecem? | `base/ILUSTRACAO.md` |
| Por que este estilo visual, qual a postura? (prosa, não configuração) | `base/DESIGN.md` |

**Os limites.** O que o texto pode dizer, e o que precisa dizer em voz alta.

| Pergunta | Arquivo |
|---|---|
| O que o texto pode e não pode dizer? | `base/EDITORIAL.md` |
| O que precisa estar declarado ao leitor? | `base/DECLARACOES.md` |

**A operação.** `base/` muda devagar; `estado/` muda a cada publicação.

| Pergunta | Arquivo |
|---|---|
| Que peças existem, com que slug e query-alvo? | `estado/CLUSTER.md` |
| Por que esse conjunto de peças vai funcionar? | `estado/TESE.md` |
| Quando cada peça sai? | `estado/CALENDARIO.md` |
| O que o funil já aprendeu? | `estado/APRENDIZADOS.md` |
| Como as métricas evoluem por peça? | `estado/METRICAS.csv` |

**O corte:** dá para escrever a primeira peça com a fundação, a voz e os
limites de pé. MONETIZACAO, ISCAS e CONCORRENTES aguentam esperar o segundo
mês. O que não dá é escrever sem TERRITORIO e LEITOR.

**Os três que nascem vazios e continuam vazios:** `CALENDARIO.md`,
`APRENDIZADOS.md` e `METRICAS.csv` são assunto de uma aula lá na frente.
Vazio ali é o estado correto, não pendência.

## Os pares que se confundem

Cada arquivo já declara no topo o que **não** mora nele. Esta é a mesma
informação na direção da busca — a pergunta que você tem na cabeça, e quem é
o dono dela.

| A pergunta que engana | Quem é o dono |
|---|---|
| "sobre o quê" × "para quem" | `TERRITORIO.md` é assunto; `LEITOR.md` é pessoa |
| "como soa" × "de onde fala" | `TOM.md` é constante entre peças; `POSTURAS.md` muda por tipo de peça |
| "como soa" × "o que pode dizer" | `TOM.md` é forma; `EDITORIAL.md` é substância |
| "como ganha dinheiro" × "o que o leitor vê disso" | `MONETIZACAO.md` é o fundo; `DECLARACOES.md` é a superfície |
| "quem assina" × "o que declarar" | `AUTOR.md` é sobre a pessoa; `DECLARACOES.md` é sobre o conteúdo |
| "que peças" × "por que essas" | `CLUSTER.md` manda em slug e query; `TESE.md` é insumo |
| "que imagens" × "que estilo visual" | `ILUSTRACAO.md` é a imagem dentro do artigo; `DESIGN.md` é o tema da página |

## Os quatro que não se comportam como os outros

1. **`base/DESIGN.md` é prosa, não configuração.** Aqui vai o porquê; a
   máquina — estilo, modo, os até 6 desvios de token — vai em
   `web/src/sites/<slug>.ts`, que é o lado que **quebra a build** quando
   está errado. Duas fontes da verdade para o mesmo fato é o que se evita.

2. **`base/PROVAS.md` é fonte, não regra.** Lista onde apurar; não dita o que
   o artigo deve dizer.

3. **`base/AUTOR.md` é o único de `base/` com consequência em código.**
   `web/src/autor.ts` congela a forma esperada e julga: campo vazio, campo
   ainda com `[DEFINIR]`, nome sem sobrenome, ou nome que é coletivo
   ("Equipe", "Redação") — e o bloco 22 não nasce na página. Byline
   meia-boca é pior que byline nenhum. Os campos cobrados estão nomeados em
   `web/src/autor.ts`; o seu `AUTOR.md` precisa responder todos.

4. **`estado/CLUSTER.md` é o único artefato com dois donos** — você e quem
   escreve. Daí o protocolo declarado lá: uma linha por slug, tabela nunca
   reordenada, prosa append-only.

## Como saber que uma resposta está de pé

- **Resposta que caberia em qualquer site do nicho não é resposta** — é o
  enunciado reescrito. "Homens de 25 a 45 interessados no assunto" não
  descreve ninguém.
- **Resposta sem um "não" está pela metade.** Quase todo arquivo pede uma
  recusa: TERRITORIO recusa assunto, TOM recusa vício, MONETIZACAO recusa
  oferta, EDITORIAL recusa afirmação. Arquivo sem recusa escrita não decide
  nada quando o caso duvidoso chegar — e ele chega.
- **Teste de uso:** pegue uma pauta duvidosa e tente decidir com o arquivo
  aberto. Se ele não decide, ainda é opinião, não doutrina.
- **Apagar as perguntas é parte do trabalho.** Stub com pergunta ainda
  visível é arquivo não respondido — e é assim que se enxerga o que falta
  num `ls`, sem abrir nada.

## Por que stubs, e não uma entrevista guiada

No workshop original essa entrevista seria conduzida por uma ferramenta de IA
que não vai para este repositório público. Os stubs são o roteiro que a
substitui — e substituem melhor: ficam versionados aqui, não viram slide que
ninguém acha depois. Responda cada arquivo como uma entrevista com você
mesmo; apague as perguntas quando a resposta estiver de pé.

## Layout

```
sites/<seu-site>/
  README.md   esta cópia do índice
  base/       o que o artigo consulta antes de escrever. Muda devagar.
  estado/     o registro da operação. Muda a cada publicação.
  pautas/     a decisão antes do texto — candidatas e a pauta de cada peça
  pesquisa/   o material bruto: link, print, número com data e fonte
  posts/      um diretório por peça, com o mesmo slug do CLUSTER.md
```

`base/` e `estado/` se explicam arquivo a arquivo: cada um abre dizendo o que
mora e o que não mora nele. As outras três nascem vazias, e por isso cada uma
tem o seu próprio README, com o formato e um exemplo:

- [`pautas/README.md`](pautas/README.md) — candidata × pauta fechada, e o que
  uma pauta precisa ter para virar texto.
- [`pesquisa/README.md`](pesquisa/README.md) — a regra de fonte e data na
  hora, e o campo que separa apuração de achismo.
- [`posts/README.md`](posts/README.md) — o `comentarios.json`: caminho,
  formato, e o que quebra a build.

## Este diretório e o `scripts/atualizar`

`scripts/atualizar` trata **tudo** sob `sites/` como seu: nada daqui aparece
nas listas NOVOS, SEGUROS ou CONFLITO, e nada daqui é sobrescrito. Isso vale
inclusive para o `_modelo`, que é do upstream mas mora do lado de dentro da
sua fronteira.

Quando os stubs melhorarem lá em cima, a puxada é à mão, e o alvo é só o
modelo:

```bash
git checkout upstream/main -- sites/_modelo
```

Seguro porque você nunca edita `_modelo` — você copia. Responder pergunta
dentro de `sites/_modelo/` custa duas vezes: a resposta se perde na próxima
puxada, e o modelo chega já respondido no seu segundo site.
