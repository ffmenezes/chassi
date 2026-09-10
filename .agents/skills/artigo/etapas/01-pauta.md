# Etapa 1 — Pauta

Transforma uma candidata aprovada em contrato: o que a peça afirma, quais
perguntas responde, o que recusa, e o que precisa ser apurado antes de
qualquer parágrafo. A pauta não redecide nada de `base/`; ela aplica a uma
peça o que `base/` já decidiu.

## Leia só isto

- A linha da candidata em `sites/<slug>/pautas/_candidatas.md`.
- `sites/<slug>/estado/CLUSTER.md` — para reservar o slug e listar os links
  internos possíveis (só slugs `publicado`).
- `sites/<slug>/base/POSTURAS.md` — os tipos de peça do site e de que lugar
  cada um fala.
- `sites/<slug>/base/LEITOR.md` — perguntas 4 e 5: o que faz fechar a aba,
  o que precisa ter em mãos ao terminar.
- `sites/<slug>/base/EDITORIAL.md` — o que o site nunca afirma sem fonte, e
  a recomendação que nunca dá.

## Escreva só isto

`sites/<slug>/pautas/<slug-da-peça>.md`, e **uma linha nova** na tabela de
`estado/CLUSTER.md` com status `pauta`.

O slug: minúsculas, hífen, sem acento, sem número de ano, sem palavra de
parada no início ("o", "a", "como" pode ficar se for a query). Duas a cinco
palavras. Não pode existir na tabela do `CLUSTER.md`.

```markdown
# <título de trabalho, copiado da candidata>

**slug:** quanto-gasta-ar-condicionado-noite
**query-alvo:** "quanto gasta ar condicionado ligado a noite toda"
**verbo do leitor:** entender          ← planta: explicativo
**tipo de peça:** guia                 ← dos tipos de POSTURAS.md
**postura:** quem refez a conta        ← POSTURAS.md
**qualificador:** número que muda (tarifa e consumo, com mês/ano)
**eixo de valor:** mais atualizado e com a conta aberta

## A tese
Uma frase afirmativa, com número, que a peça vai sustentar. Não é
pergunta. Se der para escrever hoje sem apurar nada, é resenha, não tese.
> Um split de 9.000 BTU inverter ligado 8 horas por noite custa entre R$ X
> e R$ Y por mês em setembro de 2026, e a diferença para o convencional
> aparece na conta em menos de dois verões.

## As três formas mais fortes de a tese estar errada
1. ...  → o que apurar para saber: ...
2. ...  → o que apurar para saber: ...
3. ...  → o que apurar para saber: ...
Se um dado, existindo, mata a tese, ele é a primeira coisa a procurar na
etapa 2. Tese que ajusta depois da apuração é vitória, não derrota.

## As perguntas que a peça responde (o contrato de escopo)
Cinco a oito, na ordem em que o leitor as faria. Cada uma vira um H2 na
etapa 3. Pergunta fora desta lista não entra no texto; vira candidata.
1. ...
2. ...

## O que o leitor tem em mãos ao terminar
A decisão, o número ou o próximo passo. Uma frase.

## O que esta peça recusa
O assunto vizinho que ela não cobre e para onde manda quem quer aquilo
(slug publicado, ou "sem peça ainda").

## Links internos previstos
Só slugs com status `publicado` no CLUSTER.md, um por linha, com a frase
em que cada um entraria. Sem nenhum publicado ainda: "nenhum".

## O que a primeira página já diz
Três a cinco linhas: o que as páginas de cima afirmam, com quem falam, e o
que nenhuma delas tem (é isso que a peça vai ter).

## O que ainda falta descobrir
Lista do que a etapa 2 precisa apurar, item a item, incluindo o dado
próprio obrigatório (qual vai ser, e como se obtém em menos de duas horas).
```

Linha no `CLUSTER.md`:

```markdown
| quanto-gasta-ar-condicionado-noite | "quanto gasta ar condicionado ligado a noite toda" | pauta |
```

Acrescente ao fim da tabela. Não reordene. Se a tabela ainda tem a linha
vazia do stub, substitua-a.

## Regras

1. **Tese é afirmativa.** "Vale a pena?" não é tese. "Vale a pena a partir
   de X horas por dia, em setembro de 2026" é. Tese sem número é opinião.
2. **Uma pergunta, um critério.** Se a resposta de uma pergunta do
   contrato depende de dois critérios em conflito ("mais barato" e "mais
   silencioso"), são duas perguntas ou dois artigos.
3. **Verbo escolhe planta.** `entender` → explicativo; `executar` →
   procedimento; `escolher` → seleção; `decidir` → veredito; `reagir` →
   atualização; `conferir` → relato (exige postura "quem fez" em
   `POSTURAS.md` e registro em `pesquisa/`). Ver `referencias/plantas.md`. Não escolha planta pelo gosto;
   o verbo veio da candidata.
4. **Postura vem de `POSTURAS.md`, e cabe no autor de `AUTOR.md`.** Se o
   site não tem postura para "quem testou pessoalmente", ou o autor não
   opera o que a peça testaria, a peça não pode prometer teste. Rebaixe
   para "quem refez a conta" ou "quem leu a norma". Abra os dois arquivos
   juntos: é o par que engana.
5. **Escopo é contrato, tamanho é consequência.** Não fixe número de
   palavras. Cinco perguntas com número dão uma peça curta e boa; oito com
   apuração dão pilar.
6. **Pilar só com o teste do valor.** Se a peça é o pilar do cluster,
   responda por escrito: alguém pagaria R$ 10 por isto, contra o que já
   está de graça na primeira página? Se a resposta é "não, mas está bem
   escrito", não é pilar.
7. **O réu nunca é o leitor.** A tese ataca uma regra genérica, um
   vendedor ou um senso comum. Se a tese só fica de pé chamando o leitor de
   errado, reescreva.

## E no diário

Acrescente a entrada da etapa 1 em `posts/<peça>/diario.md` (gabarito
no fim do SKILL.md): feito, decidido (com a alternativa que perdeu),
descartado, adiado, travou em, tempo. É aqui que o diário nasce: crie o arquivo com o cabeçalho. A alternativa
que perdeu costuma ser outra planta, outra query ou outra candidata.

## Checagem antes de fechar

- [ ] Entrada desta etapa no `diario.md`, com os cinco campos.
- [ ] Slug não existe no `CLUSTER.md` e a linha nova foi acrescentada com
      status `pauta`.
- [ ] Query-alvo da pauta é idêntica à do `CLUSTER.md`, aspas incluídas.
- [ ] A tese é uma frase afirmativa com ao menos um número a apurar.
- [ ] Há três formas de estar errada, cada uma com o que apurar.
- [ ] Contrato tem 5 a 8 perguntas e nenhuma repete outra peça do cluster.
- [ ] "O que recusa" tem ao menos um assunto vizinho.
- [ ] "O que ainda falta descobrir" nomeia o dado próprio obrigatório.
- [ ] Nenhum link interno aponta para slug que não está `publicado`.

## Se travar

- Tese não fecha porque a candidata era vaga: volte à candidata e
  reenquadre a query, registrando na coluna corte da `_candidatas.md`
  ("reenquadrada em <slug>"). Não invente tese para preencher.
- `POSTURAS.md` está em branco: a única postura disponível é "quem leu a
  fonte e refez a conta". Escreva isso na pauta e avise o dono.
- A pauta pede dado que só se obtém com dias de trabalho (ligar para
  órgão, medir por semanas): marque a peça como pilar candidato e pergunte
  ao dono antes de seguir para a etapa 2. É uma das poucas decisões que
  são dele.
