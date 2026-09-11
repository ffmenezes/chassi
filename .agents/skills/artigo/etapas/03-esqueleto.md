# Etapa 3 — Esqueleto

Caminhos: `sites/`, `web/` e `scripts/` partem da raiz do checkout do
chassi; `referencias/` parte de `.agents/skills/artigo/`. `base/`,
`estado/`, `pautas/`, `pesquisa/` e `posts/` abreviados partem de
`sites/<slug>/`. Rode scripts da raiz, com o caminho completo da peça.
Site novo exige o par de cópias descrito em `sites/_modelo/README.md`.

Decide a estrutura e fecha todos os números antes de existir prosa. O
esqueleto lista os capítulos (H2), e para cada um a resposta em uma frase,
os dados do dossiê que ela usa e o bloco que a apresenta. Depois de
conferido, **congela**: a etapa 4 escreve por cima dele sem mudar um
número, e a etapa 6 confere o texto contra ele.

Calcular e argumentar são atos separados. Aqui só se calcula.

## Leia só isto

- `sites/<slug>/pautas/<peça>.md` — o contrato de perguntas e o verbo.
- `sites/<slug>/pesquisa/<peça>/dossie.md` — os dados, e a tese na versão
  pós-apuração.
- `referencias/plantas.md` — a ordem dos capítulos para o verbo da pauta.
- `referencias/quando-cada-bloco.md` — o sinal de conteúdo que chama cada
  bloco, a condição e o orçamento por peça. É por ela que o campo `bloco:`
  se preenche.
- `referencias/blocos.md` — só a tabela de blocos, para o nome da diretiva.
- `sites/<slug>/estado/CLUSTER.md` e `web/src/sites/<slug>.ts` — status e
  blocos disponíveis para esta peça.
- Os outros `sites/<slug>/posts/*/esqueleto.md` — só a lista de H2 de cada
  um, para a regra 8.

## Escreva só isto

`sites/<slug>/posts/<peça>/esqueleto.md`. Ao congelar, mude o status da
peça no `CLUSTER.md` para `esqueleto`.

```markdown
# Esqueleto — <slug da peça>

**planta:** explicativo
**tese (pós-apuração):** <copiada do dossiê, seção "Ataque à tese">
**estado:** RASCUNHO            ← vira CONGELADO no fim

## Título
Candidatos (3 a 5), com contagem de caracteres:
1. Quanto gasta um ar-condicionado ligado a noite toda em 2026 (58)
2. ...
**escolhido:** 1
**description (150 a 160):** <frase que cita um número ou método que existe
no corpo; contagem: 156>
**selo:** Guia de consumo

## Abertura (bloco 1)
**cena:** uma frase, o momento em que o leitor está (da seção "O que o
leitor diz").
**problema:** uma frase, com dado verificável, até a segunda linha. É o que a peça
resolve.

## Conclusões (bloco 2)
Três a cinco, autossuficientes, cada uma com dado verificável ou lacuna e ressalva:
- Ligado 8 h por noite, o split de 9.000 BTU inverter custa **R$ 24 a
  R$ 37 por mês** (D1 × D2), em SP, setembro de 2026, bandeira verde.
- ...

## Capítulos

### C1 — <H2 com informação, não rótulo: "Quanto o aparelho consome em
uma noite, em kWh">
**pergunta do contrato:** 1
**resposta:** uma frase de 25 a 45 palavras que responde sozinha, com
dado verificável, data e origem, e sobrevive extraída da página.
**dados:** D2, D5
**conta:** 0,75 kW × 8 h × 0,15 a 0,23 = 0,9 a 1,4 kWh (refeita aqui)
**depende de:** temperatura configurada, isolamento (declarar)
**bloco:** `tabela-panorama` (4): modelo × potência × kWh/noite   ← nome da diretiva, de referencias/blocos.md
**não entra:** consumo do convencional (é C3)

### C2 — ...

## FAQ (bloco 9)
Três a seis perguntas literais do dossiê, cada uma com a resposta em 50 a
100 palavras ou o C que já responde (aí a resposta são duas frases
apontando para lá).

## Fechamento (bloco 10)
O critério que o leitor leva: uma frase. O primeiro passo concreto: uma
frase. Nada de "o futuro".

## Contas refeitas
Toda conta do esqueleto, refeita do zero, em ordem de dependência, com
unidade. Se uma conta usa outra, a outra vem antes.
1. D2: ...
2. Conclusão 1: D1 × D2 = ...
Conferência inversa: ...

## Objeções do redator
(vazio ao congelar; a etapa 4 escreve aqui se discordar de um número)
```

## Regras

1. **Um H2 por pergunta do contrato**, na ordem da planta. Quatro a oito
   H2. Menos de quatro e o sumário (bloco 3) não nasce; a peça pode ser
   curta, mas não pode ter três capítulos. **A planta é ordem, não cota:**
   pergunta que não cabe em nenhuma linha da planta vira H2 próprio, na
   posição em que o leitor a faria; duas perguntas que caem na mesma linha
   viram um H2 com dois H3 se a resposta é uma, ou dois H2 se são duas
   respostas com dois números.
2. **H2 carrega informação.** "Consumo" é rótulo; "Quanto o aparelho
   consome em uma noite, em kWh" é H2. Nunca todos em forma de pergunta;
   nunca um fragmento que o primeiro parágrafo repete.
3. **A resposta de cada capítulo é uma frase que sobrevive sozinha.** Com
   dado verificável, data e origem; número quando a pergunta é
   quantitativa. Pergunta sobre lacuna declara `[SEM DADO]` e seu limite,
   sem inventar número para caber no gabarito. A frase deve preservar seu
   sentido mesmo citada fora da página.
4. **Todo número aponta um D, e leva a marca dele.** Número sem D no
   esqueleto é número que não existe. Em `resposta:`, `conta:` e nas
   conclusões, o número que não é `[FONTE]` carrega a marca
   (`[ESTIMATIVA]`, `[PISO: ...]`, `[PREMISSA]`); é dali que a etapa 4 a
   copia e a etapa 5 a transforma em frase. `[PREMISSA]` só onde o dossiê tem `[SEM DADO]`, e o capítulo
   diz ao leitor onde ele pega o valor real dele.
5. **Bloco só por sinal de conteúdo.** O campo `bloco:` se preenche pela
   tabela de `referencias/quando-cada-bloco.md`: o sinal está na
   `resposta:` e nos `dados:` do capítulo (três itens com atributos, dois
   lados na mesma base, ações em ordem, frase literal de pessoa nomeada,
   consequência irreversível). Sem sinal, o capítulo é prosa, e prosa é o
   padrão. Orçamento: um bloco de dado por capítulo, um de cada família
   por peça fora de pilar, duas citações destacadas e dois avisos no
   máximo. Estourou: fica o que responde o H2, e `não entra:` anota o
   resto.
6. **Regra do slot.** Um bloco só entra se todo campo dele sai de número
   deste esqueleto. Tabela com uma célula sem dado perde a coluna; coluna
   que não dá para preencher inteira não existe; célula que precisa
   existir e não tem dado é `[sem dado confiável]`, nunca estimativa.
7. **Soma incompleta é piso.** Conta que exclui parcela leva
   `[PISO: exclui frete]` colado ao número, inclusive nas conclusões.
8. **Título promete o entregável.** Menos de 60 caracteres; query nos
   primeiros 40; ano só se a peça é datada; promete o número, a
   verificação ou a regra, nunca a curiosidade. Sem "ninguém te conta",
   sem "o segredo", sem número de itens quando há preço ("os 7 melhores"
   mente quando sai o oitavo).
9. **Sem esqueleto gêmeo.** Compare a lista de H2 com a dos outros
   esqueletos do site. Se dois ficam iguais trocando o substantivo, este
   está seguindo o molde e não a pauta. Reordene ou funda capítulos até a
   estrutura ser desta peça.
10. **A description é auditável.** Cita um número ou um método que existe
   no corpo. "Descubra tudo sobre" não é description.
11. **Conclusões são o que o leitor levaria se lesse só a caixa.** Cada
    uma com o dado (número, condição ou regra) e a ressalva do corpo;
    ressalva que evapora na caixa é mentira por omissão. Não invente
    numeral para conclusão sobre procedimento ou ausência de dado.

O que **não** congela: `minutos` (é contagem de palavras da costura),
`publicado` e `atualizado` (são da entrega). Tudo o mais que tem número
congela.

## Congelar

Resultado calculado que vai aparecer no texto também ganha um D no
dossiê antes de congelar. Acrescente sem alterar os dados de entrada:

```markdown
### D<n> — <resultado calculado, com unidade>
**valor:** <resultado exato ou faixa>
**marca:** [FONTE] (cálculo exato sobre D1 e D2; não é medição)
**fonte:** D1 e D2 — <URLs já abertas>
**consultado em:** <datas de coleta de D1 e D2>
**calculado em:** <data da conferência>
**frases literais de origem:** ver os trechos de D1 e D2
**conta:** <expressão completa com unidades e resultado>
**o que este dado NÃO diz:** <limites herdados das entradas>
```

Se usa estimativa, mantenha `[ESTIMATIVA]`; se usa um valor de exemplo,
mantenha `[PREMISSA]` e o cenário explícito, nunca `[FONTE]`. Fonte e frase
do resultado apontam para as entradas: não invente uma citação dizendo
que a página fez a nossa conta. O esqueleto referencia esse D e refaz a
conta como conferência, incluindo a inversa quando aplicável.

Quando a checagem abaixo passa inteira, troque `estado: RASCUNHO` por
`estado: CONGELADO` e a data. A partir daí ninguém muda número aqui sem
voltar ao dossiê.

## E no diário

Acrescente a entrada da etapa 3 em `posts/<peça>/diario.md` (gabarito
no fim do SKILL.md): feito, decidido (com a alternativa que perdeu),
descartado, adiado, travou em, tempo. Registre a pergunta do contrato que virou H3 ou saiu, e o bloco
considerado e não usado.

Gabarito desta entrada (acrescente ao diário; não substitua entradas):

```markdown
## <data> · etapa 3 · esqueleto
**feito:** <arquivos e resultado>
**decidido:** <escolha, critério e alternativa que perdeu>
**descartado:** <item e motivo, ou nada>
**adiado:** <item e destino/condição, ou nada>
**travou em:** <obstáculo e encaminhamento, ou nada>
**tempo:** <duração medida, estimativa declarada ou não medido>
```

## Checagem antes de fechar

- [ ] Entrada desta etapa no `diario.md`, com os seis campos.
- [ ] 4 a 8 capítulos, cada um com pergunta do contrato, resposta em uma
      frase, dados (D), bloco e "não entra".
- [ ] Toda conta está em "Contas refeitas", em ordem de dependência, com
      unidade, e a conferência inversa bate.
- [ ] Nenhum número no esqueleto sem D; nenhum D `[SNIPPET]`.
- [ ] Toda conclusão tem dado verificável ou lacuna explícita e ressalva.
- [ ] Título escolhido tem menos de 60 caracteres e a query nos primeiros
      40; description tem 150 a 160.
- [ ] Lista de H2 não coincide com a de outro esqueleto do site.
- [ ] Todo bloco listado existe em `blocos` do `web/src/sites/<slug>.ts`.
      Não existe: acrescente lá (o arquivo é do participante, e a régua
      de conteúdo manda no bloco, não o molde do `exemplo.ts`), rode
      `cd web && npm run check`, e anote no diário. Só vira pendência
      quando quem executa não é o dono do site.
- [ ] Todo `bloco:` tem uma linha em `quando-cada-bloco.md` que o
      justifica pelo conteúdo do capítulo, e o orçamento fecha.
- [ ] Status no `CLUSTER.md` mudou para `esqueleto`.

## Se travar

- Uma pergunta do contrato não tem dado nem `[SEM DADO]` no dossiê: volte
  à etapa 2 para aquele item só. Não escreva o capítulo "por cima".
- A conta não fecha na conferência inversa: o erro está no dossiê ou na
  conta; ache antes de congelar. Foi exatamente isso que já custou um
  artigo inteiro.
- O verbo da pauta não combina com o que os dados permitem (pauta pede
  "decidir" e o dossiê só sustenta "entender"): rebaixe a planta, anote a
  troca no topo do esqueleto e na prosa do `CLUSTER.md`.
