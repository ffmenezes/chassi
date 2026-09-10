---
name: pitaco
description: Use quando o dono leu uma peça e quer pôr o toque dele — "adiciona meu pitaco em X", "quero dizer que na minha experiência...", "coloca uma opinião minha nesse capítulo", "esse artigo está sem a minha cara". Costura a voz do autor numa peça já costurada ou pronta, no lugar certo, sem mexer em número, e registra o que entrou. Nunca inventa experiência que o dono não contou.
---

# Dar o pitaco do autor

O método `artigo` produz peças que se defendem ponto a ponto contra o
dossiê. O que ele não produz é a pessoa: a opinião de quem assina, o caso
que ela viveu, a ressalva que só ela sabe. Isto é o que o Google chama de
experiência em primeira mão, e é o que um leitor lembra. Esta skill
existe para pôr isso na peça **depois** que a peça está de pé, sem
derrubar o que a sustenta.

**A regra que sustenta tudo: o pitaco é do dono, com as palavras dele.**
Você não inventa a opinião, não "melhora" a experiência com detalhe que
ele não contou, e não transforma o pitaco em número sem fonte. Você
encaixa, poda e marca.

## O que é um pitaco

Três tipos, e só três. Cada um tem um lugar e uma forma:

| tipo | o que é | onde entra | forma |
|---|---|---|---|
| **opinião** | "eu acho que", "eu não faria" | no capítulo que trata do assunto, depois do dado, nunca antes | um parágrafo em primeira pessoa, com o "porque" |
| **experiência** | "quando eu fiz", "no meu caso" | onde o texto diz "depende" ou "varia" | um parágrafo com data, lugar e o que aconteceu, inclusive o que deu errado |
| **ressalva** | "cuidado com", "o que ninguém fala é" | junto do número ou do passo que ela limita | uma ou duas frases, coladas ao que limitam |

Pitaco que traz número ("no meu caso a conta veio R$ 380") entra como
`experiência própria`, com data e método ("conta de agosto de 2026,
Enel SP"), e vira bloco `D` no dossiê. Sem data, entra como opinião, sem
o número.

## Leia só isto

- O pitaco, como o dono escreveu (mensagem, nota, áudio transcrito). Se
  ele não escreveu, pergunte; não deduza "o que ele acharia".
- `sites/<slug>/posts/<peça>/post.md` — a peça.
- `sites/<slug>/base/TOM.md` — o parágrafo de amostra: o pitaco soa
  assim, não como um recado colado.
- `sites/<slug>/base/POSTURAS.md` — a postura da peça diz se ela pode
  falar em primeira pessoa e de que lugar.
- `sites/<slug>/pesquisa/<peça>/dossie.md` — só se o pitaco traz número.

## O procedimento

1. **Classifique** cada pitaco num dos três tipos. Um pitaco que mistura
   os três vira três parágrafos, ou o dono escolhe.
2. **Ache o lugar.** O capítulo cujo assunto é o do pitaco; dentro dele,
   depois do parágrafo que traz o dado (opinião), no "depende" (experiência)
   ou colado ao número (ressalva). Nunca na abertura, nunca nas
   conclusões, nunca na FAQ: essas três são as partes que o esqueleto
   congelou e que o resumo automático cita.
3. **Reescreva no tom, não no seu.** Mantenha as palavras que são a marca
   do dono (a expressão, o exemplo, o objeto); corte o que é conversa
   ("aí eu pensei", "tipo assim"); não acrescente detalhe. Primeira pessoa
   do singular. Compare com o parágrafo de amostra do `TOM.md`.
4. **Marque.** O parágrafo entra como prosa comum, sem caixa nem itálico:
   a marca é a primeira pessoa e o conteúdo, não a moldura. Se o site
   exige (ver `base/DECLARACOES.md`), a seção "Como esta peça foi feita"
   ganha uma linha: "opinião e relato do autor acrescentados em <data>".
5. **Se trouxe número, passa pelo dossiê.** Bloco `D` novo com marca
   `[FONTE]` (dado próprio: método e data) e o número no texto igual ao do
   bloco. Sem data e método, o número não entra; a frase fica sem ele.
6. **Confira o que o pitaco derruba.** Se a opinião contradiz uma
   conclusão da peça ("eu não compraria", numa peça que diz que compensa),
   o pitaco não entra como aparte: é a peça que precisa mudar de
   veredito, e isso volta ao método (`etapas/03-esqueleto.md`, seção
   "Objeções"). Diga isso ao dono em vez de deixar as duas coisas na
   página.
7. **Rode a higiene e a régua.** `scripts/higiene-texto` e
   `scripts/medir-texto`; a nova prosa obedece à lista dura de
   `artigo/referencias/antipadroes.md` (sem travessão, sem "não é X, é
   Y", sem fecho de efeito). Pitaco é lugar típico de aforismo.
8. **Registre no diário.** Entrada `pitaco` em `posts/<peça>/diario.md`:
   o que entrou, onde, e o que foi cortado ou devolvido ao dono. Se a
   peça já está `pronto` e o pitaco muda fato ou número, `atualizado` move
   e a etapa 6 roda de novo; se só acrescenta opinião, `atualizado` não
   move.

## Limites

- **Até três pitacos por peça.** Mais que isso não é toque, é outra voz
  competindo com a peça; a partir do quarto, o lugar é uma peça de
  relato (planta `relato`), com o dono como herói.
- **Pitaco não vira título, description nem conclusão.** Essas partes
  são o contrato com a busca.
- **O réu continua não sendo o leitor.** "Quem compra isso não pensou"
  não entra, mesmo vindo do dono; vira "eu não compraria, porque".
- **Não inventa.** Se o dono disse "acho que gasta mais", você escreve
  "acho que gasta mais", não "medi e gastou 30% a mais".

## Como saber que terminou

- Cada pitaco tem um lugar, um tipo e está na peça em primeira pessoa,
  ou foi devolvido ao dono com o motivo.
- Nenhum número novo sem bloco `D`.
- Higiene e medição rodaram; nenhum item novo da lista dura.
- Entrada `pitaco` no diário.

## O que nunca fazer

- Escrever o pitaco que o dono "provavelmente daria".
- Pôr o pitaco numa caixa destacada, em itálico ou com rótulo "opinião
  do autor": a moldura é o que faz parecer enxerto.
- Deixar opinião e conclusão contraditórias na mesma página.
