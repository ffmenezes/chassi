# pautas/

**A decisão antes do texto.** Uma peça entra aqui quando já se sabe o que ela
promete e para qual busca ela existe — e sai daqui para virar artigo.

Nada nesta pasta é lido por código nenhum. O formato abaixo é sugestão; o que
não é sugestão é o slug, que precisa bater com a linha da peça no
`estado/CLUSTER.md`.

```
pautas/
  _candidatas.md                        a lista solta, sem compromisso
  como-configurar-o-roteador.md         uma pauta fechada, um arquivo
  quanto-gasta-um-ar-condicionado.md
```

O `_` na frente de `_candidatas.md` é só para ele ficar no topo do `ls`.

## Candidatas × pauta fechada

- **Candidata** é uma linha: a ideia, de onde ela veio (busca do leitor,
  pergunta em comentário, brecha do concorrente), e nada mais. Ideia sem
  compromisso não merece arquivo próprio.
- **Pauta fechada** é a peça decidida: já tem slug, já tem query-alvo, já
  entrou no `CLUSTER.md`. Aí ganha arquivo.

O caminho de uma para a outra é uma pergunta só: **eu conseguiria escrever
isto sem descobrir nada de novo?** Se sim, provavelmente não vale a peça. Se
não, o que falta descobrir vai para `pesquisa/`.

## O que uma pauta precisa ter para virar texto

Cada item abaixo já tem dono num arquivo de `base/` — a pauta não redecide
nada, ela **aplica** a uma peça:

```markdown
# Como configurar o roteador para o quarto dos fundos

**slug:** como-configurar-o-roteador
**query-alvo:** "wifi não pega no quarto"        ← igual à do CLUSTER.md
**tipo de peça:** tutorial                       ← dos tipos de POSTURAS.md
**postura:** quem apurou pessoalmente            ← POSTURAS.md

## A promessa
Em uma frase, o que o leitor leva daqui. Se ela não couber numa frase, a
peça está fazendo duas coisas.

## O que o leitor tem em mãos ao terminar
A decisão, o número ou o próximo passo — o que LEITOR.md diz que ele veio
buscar.

## O que esta peça recusa
O assunto vizinho que ela não cobre, e para onde manda quem quer aquilo.
Sem isto, toda pauta cresce até virar três artigos ruins.

## Fontes que vão ser abertas
Links de PROVAS.md que esta peça de fato consulta — com data da consulta.
O que não for aberto de verdade não entra no texto.

## O que ainda falta descobrir
→ vira arquivo em pesquisa/
```

## O sinal de que a pauta está pronta

Você consegue dizer, sem abrir mais nada, **o que esta peça afirma que
nenhuma das três primeiras posições do Google afirma hoje**. Se a resposta for
"ela diz o mesmo, melhor escrito", ainda não é pauta — é reescrita, e o
`base/CONCORRENTES.md` já avisou que isso não ganha a busca.
