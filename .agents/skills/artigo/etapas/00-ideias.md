# Etapa 0 — Ideias

Produz um lote de candidatas a pauta. Candidata é uma linha, não um
compromisso: ideia, de onde veio, para qual busca existe e qual vantagem
ela teria contra o que já está na primeira página. O lote é grande de
propósito; o corte é o que faz o lote valer.

Um tema que veio pronto do dono também passa por aqui, como candidata
única: ganha a mesma linha e os mesmos cortes.

## Leia só isto

- `sites/<slug>/base/TERRITORIO.md` — o que o site cobre e o que recusa.
- `sites/<slug>/base/LEITOR.md` — quem lê, o que já tentou, o que digita.
- `sites/<slug>/base/CONCORRENTES.md` — quem ocupa o espaço e o que faz mal.
  Pode estar em branco; aí o gerador 3 fica sem insumo.
- `sites/<slug>/estado/TESE.md` — no que a casa aposta. Pode estar em branco.
- `sites/<slug>/estado/CLUSTER.md` — o que já existe. Candidata que repete
  slug ou query-alvo de lá não entra.
- `sites/<slug>/pautas/_candidatas.md` — o que já foi proposto e cortado.
  Não proponha de novo o que já morreu, a não ser reenquadrado.

## Escreva só isto

`sites/<slug>/pautas/_candidatas.md`, **acrescentando** um bloco datado ao
fim. Nunca reescreva bloco anterior. Se o arquivo não existe, crie com o
cabeçalho.

```markdown
# Candidatas

Uma linha por ideia. Bloco por rodada, append-only. Candidata cortada
fica, com o corte que a matou.

## Rodada 2026-09-10

| # | título de trabalho | query literal | verbo | origem | qualificador | corte |
|---|---|---|---|---|---|---|
| 1 | Quanto custa manter um ar-condicionado ligado a noite toda | "quanto gasta ar condicionado ligado a noite toda" | entender | LEITOR perfil 2 × estágio "conta chegou" | número que muda (tarifa 09/2026) | passou |
| 2 | Inverter ou convencional: a diferença na conta em 12 meses | "ar condicionado inverter vale a pena" | decidir | CONCORRENTES erro 1 (comparam sem tarifa) | verificação (conta refeita) | passou |
| 3 | Os 10 melhores ar-condicionados de 2026 | "melhor ar condicionado 2026" | escolher | autocomplete | nenhum | corte 3: sem qualificador |

Aprovadas nesta rodada: 1, 2.
Adiadas: nenhuma.
Escolhida para a próxima peça: 1, porque é a mais barata de apurar e a
query tem o qualificador mais forte. As outras aprovadas ficam na fila.
```

Colunas:

- **título de trabalho** — a promessa em uma frase, sem se preocupar com
  tamanho. O título de verdade nasce na etapa 3.
- **query literal** — entre aspas, com as palavras que o leitor digita, não
  as suas. `LEITOR.md` pergunta 3 é a fonte; autocomplete e "as pessoas
  também perguntam" são as outras duas. Quando a frase do `LEITOR.md` e o
  autocomplete divergem, **o autocomplete decide a query-alvo** (é o que
  foi medido em busca real) e a frase do `LEITOR.md` vira vocabulário da
  peça e candidata a FAQ; registre as duas na linha.
- **verbo** — o que o leitor quer fazer ao terminar: `entender`,
  `executar`, `escolher`, `decidir`, `reagir`, `conferir` (quer saber o
  que acontece de verdade quando alguém faz; só cabe com qualificador
  `experiência própria` e registro). Um só. É ele que escolhe a
  planta na etapa 3.
- **origem** — de qual gerador a ideia saiu, com o item (perfil, erro,
  peça). Ideia sem origem rastreável é ideia sua, e a sua cabeça não é
  fonte.
- **qualificador** — a razão pela qual um resumo automático de busca não
  responde esta pergunta. Um dos quatro, ou nenhum:
  `número que muda` (preço, tarifa, prazo, com data),
  `verificação` (conta refeita, teste, medição que alguém precisou fazer),
  `regra BR` (norma, lei, prática local que a resposta genérica ignora),
  `experiência própria` (algo que foi feito e registrado).
- **corte** — `passou`, `corte N: motivo`, ou `adiada: <até quando ou até
  o quê>` (candidata boa cujo momento não é este: sazonal, depende de
  outra peça publicada, ou o dado ainda não saiu). Adiada volta na
  rodada em que a condição vale, e é o primeiro lugar onde a rodada
  seguinte olha.

## Os geradores

Rode ao menos três dos cinco. Vinte candidatas é o piso de uma rodada;
menos que isso o corte não tem de onde escolher.

1. **Grade leitor × momento.** `LEITOR.md` descreve uma pessoa (às vezes
   mais de uma; aí é uma linha por pessoa). Para ela, os três momentos:
   antes de decidir, na hora de fazer, depois que deu errado. Cada casela
   é uma pergunta que ela digitaria naquele momento. A resposta 6 do
   `LEITOR.md` ("quem parecido este site não serve") dá a quarta linha da
   grade: a pergunta que essa outra pessoa faria, e que o site recusa.
   Casela sem peça no `CLUSTER.md` é candidata.
2. **Obsessões × formatos.** Liste desejos e medos do leitor (as palavras
   dele, de comentário e fórum, não as suas; `LEITOR.md` perguntas 7 e 8
   já trazem o vocabulário e a crença errada). Cruze cada um com:
   "como [fazer] sem [medo]", "quanto custa [desejo] em [ano]",
   "[coisa] vale a pena para [perfil]", "o que muda em [coisa] com [regra
   nova]".
3. **O que o concorrente assume.** Para cada erro em `CONCORRENTES.md`
   (a pergunta 5 de lá já lista as suposições sem prova), duas perguntas: o que o autor assume que o leitor acredita? O que o
   leitor precisa acreditar para aceitar aquilo? A resposta contrária, com
   um número, é candidata de veredito.
4. **Novos ângulos das peças publicadas.** Para cada linha `publicado` no
   `CLUSTER.md`: qual pergunta o leitor faz depois de ler aquela
   (`LEITOR.md` pergunta 10 é o ponto de partida)? Qual
   pergunta a peça recusou responder ("o que esta peça recusa" na pauta)?
   Cada uma é satélite candidato, com a peça de origem na coluna origem.
5. **Busca real.** Autocomplete do Google para a semente do território
   (`https://suggestqueries.google.com/complete/search?client=firefox&hl=pt-BR&gl=br&q=<semente>`
   costuma responder sem bloqueio) e as perguntas de "as pessoas também
   perguntam". Copie literal, não "melhore".

## Os cortes, em cascata

Aplique na ordem. Candidata reprova no primeiro corte que falha; não tire
média.

1. **Pergunta real.** Alguém digita isto, com estas palavras? Prova aceita:
   apareceu no autocomplete, no "também perguntam", em título de fórum, em
   `LEITOR.md` pergunta 3. Ideia que só você formulou reprova.
2. **Destinatário.** Abra os dez primeiros resultados da query (uma busca
   por candidata) e conte com quem cada página fala. O orçamento: abra de
   verdade para toda candidata que chegou até aqui viva; candidata que
   caiu no corte 1 não gasta busca. Vinte candidatas são vinte buscas, e
   é por isso que os cortes vêm em cascata. Se não dá para abrir (bloqueio,
   sem ferramenta), a candidata fica com corte `2: não verificado` e só
   pode ser escolhida depois de verificada na etapa 1. Se menos de quatro falam com o perfil de
   `LEITOR.md`, a query pertence a outro leitor. Reenquadre ("para quem
   produz", "custo por peça", "no Brasil") antes de descartar.
3. **Qualificador.** Sem um dos quatro qualificadores, a peça diz o que o
   resumo automático já diz, melhor escrito. "Escrevo melhor" não é
   qualificador. Reenquadrar aqui é acrescentar um número datado, uma
   verificação ou uma regra brasileira à promessa.
4. **Custo de apurar.** O qualificador dá para levantar em menos de duas
   horas (preço em duas lojas, norma lida, simulador rodado)? Se exige
   dias, só entra como pilar, e pilar é uma por cluster.
5. **Dentro do território.** `TERRITORIO.md` recusa? Reprova, mesmo
   passando em tudo acima.

Registre o corte que matou. Candidata reprovada em 3 costuma voltar
reenquadrada na rodada seguinte, e o registro é o que evita propor a
mesma versão de novo.

## Checagem antes de fechar

- [ ] O bloco da rodada tem data e ao menos 20 linhas (ou uma, no caso de
      tema dado).
- [ ] Toda linha tem query entre aspas, verbo único e origem com item.
- [ ] Nenhuma aprovada repete query-alvo do `CLUSTER.md`.
- [ ] Toda aprovada tem qualificador diferente de `nenhum`.
- [ ] As linhas "Aprovadas nesta rodada", "Adiadas" e "Escolhida para a
      próxima peça" existem, a última com o motivo em uma frase.
- [ ] Nada foi apagado ou reordenado nos blocos anteriores.

## Se travar

- `LEITOR.md` só tem perfil genérico ("homens de 25 a 45"): pare, diga ao
  dono que o gerador 1 não tem insumo, e rode só 3, 4 e 5.
- Não conseguiu abrir o autocomplete: registre "autocomplete indisponível
  em <data>" no fim do bloco e siga com os outros geradores.
- Todas reprovam no corte 3: o território está genérico demais ou o
  leitor está longe de decisão com número. Anote isso como observação no
  fim do bloco; é insumo para `estado/TESE.md`, não falha sua.
