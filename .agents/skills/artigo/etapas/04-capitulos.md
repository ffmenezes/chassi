# Etapa 4 — Capítulos

Caminhos: `sites/`, `web/` e `scripts/` partem da raiz do checkout do
chassi; `referencias/` parte de `.agents/skills/artigo/`. `base/`,
`estado/`, `pautas/`, `pesquisa/` e `posts/` abreviados partem de
`sites/<slug>/`. Rode scripts da raiz, com o caminho completo da peça.
Site novo exige o par de cópias descrito em `sites/_modelo/README.md`.

Escreve a prosa de **um capítulo por vez**, a partir do esqueleto
congelado. Cada capítulo é um arquivo. O redator não apura, não calcula e
não decide estrutura: transforma a resposta e os dados do capítulo em
texto que o leitor de `LEITOR.md` lê até o fim.

Esta etapa é a que mais se repete, e é a que um modelo pequeno executa
melhor: contexto curto, uma tarefa, um arquivo.

## Leia só isto

- `sites/<slug>/posts/<peça>/esqueleto.md` — **inteiro na primeira vez**
  (para saber o que os outros capítulos cobrem e não repetir), depois só
  a seção do capítulo da vez mais as Conclusões.
- Os blocos `D` do dossiê listados em `dados:` do capítulo. Só esses.
- `sites/<slug>/base/TOM.md` — como o texto soa. O parágrafo de amostra é
  a régua.
- `sites/<slug>/base/LEITOR.md` — vocabulário e conhecimento de quem lê.
- `sites/<slug>/estado/CLUSTER.md` — status da peça e dos links internos.
- `sites/<slug>/base/POSTURAS.md` — a postura da pauta, e o que ela exige
  dizer quando o autor não testou.
- Se já existe algum `capitulos/NN-*.md` desta peça: o último parágrafo do
  anterior, para não abrir igual.
- `referencias/blocos.md` — somente a sintaxe de um bloco previsto que
  não esteja na cola abaixo; não invente atributos.

Cola das diretivas mais usadas, para não reabrir `referencias/blocos.md`
a cada capítulo (a lista completa está lá):

```markdown
:::tabela-panorama{fonte="<de onde, mês/ano>"}
| coluna | coluna |
|---|---|
:::

:::citacao
Uma conclusão nossa, em uma frase.
:::

:::aviso{tipo="nota" titulo="..."}   (tipo="atencao" exige fonte="...")
texto
:::

:::checklist{rotulo="..."}
- [ ] **forte** resto
:::

:::figura{papel="prova" alt="..." legenda="..." fonte="..., data" pendencia="arquivo em pesquisa/"}
:::

:::grafico{tipo="barra" titulo="<o que mede, com unidade>" unidade="R$" fonte="<de onde, data>"}
| categoria | série |
|---|---|
:::
```

Um capítulo por invocação é o modo para modelo pequeno. Modelo grande na
mesma sessão escreve os capítulos em sequência, um arquivo por vez, sem
abrir outra sessão para cada um: o que importa é o contexto curto por
capítulo, não o processo separado.

Não leia `referencias/antipadroes.md` aqui. É a etapa 6 que aplica; ler
antes de escrever produz texto que desvia da lista em vez de texto que diz
algo.

## Escreva só isto

`sites/<slug>/posts/<peça>/capitulos/NN-<h2-em-slug>.md`, onde `NN` é o
número do capítulo com dois dígitos. Um arquivo por invocação está certo.
Ao escrever o primeiro capítulo, mude o status no `CLUSTER.md` para
`rascunho`.

```markdown
## Quanto o aparelho consome em uma noite, em kWh

Primeiro parágrafo cumpre o H2: a resposta do esqueleto, em prosa, com o
número e a data. Quem ler só este parágrafo sai com a resposta.

Segundo parágrafo em diante: como se chega ao número, o que muda a conta,
o que o dado não cobre. Aqui entra o dado próprio, com método e data, na
primeira pessoa que a postura permitir.

:::tabela-panorama{fonte="Fichas técnicas dos fabricantes, set/2026 (D5)"}
| Modelo | Potência (W) | kWh por noite de 8 h |
|---|---|---|
| ... | ... | ... |
:::

Parágrafo que fecha o capítulo no último fato, não numa frase de efeito.
```

Regras de forma do arquivo:

- Começa com o H2 exato do esqueleto, em `##`. H3 dentro, nunca H4.
- Sem travessão nem meia-risca (`—`, `–`, ` -- `): vírgula, ponto,
  dois-pontos ou parênteses. Sem emoji. Aspas retas. São as três coisas
  que a etapa 6 corrige em massa quando ninguém avisa antes.
- Blocos entram na sintaxe de `referencias/blocos.md` (`:::nome{...}`).
  Só o bloco que o esqueleto listou para este capítulo.
- Número entra colado à unidade e com a marca do esqueleto quando não é
  `[FONTE]`: `R$ 24 a R$ 37 por mês [ESTIMATIVA]`, `[PISO: exclui frete]`.
  A etapa 5 decide como a marca aparece ao leitor; aqui ela viaja. Quem
  preferir já escrever a frase ("estimativa sobre a ficha técnica, não
  medição") pode, desde que a frase diga o que a marca diria: o que não
  pode é o número sair sem uma coisa nem outra.
- Link interno entra como `[texto](/slug/)` só para slug `publicado`;
  qualquer outro entra como `[texto][LINK PENDENTE: slug]`.
- Link externo entra como `[texto](URL do D)`, com a URL do dossiê, nunca
  digitada de memória.
- Sem referência para a frente ("como veremos", "mais adiante") nem para
  trás ("como vimos"). Cada capítulo fica de pé sozinho; a etapa 5 liga.

## Regras de prosa

1. **O primeiro parágrafo responde.** Se o leitor parar ali, tem a
   resposta do H2 com o dado e a data, ou a lacuna explícita prevista no
   esqueleto. Contexto e mecanismo vêm depois.
2. **Número só do esqueleto.** Discordou, ou achou o esqueleto errado
   (número, data, nome)? Não corrija na prosa: escreva em "Objeções do
   redator" no esqueleto, com o D que prova, e pare este capítulo. Quem
   corrige o esqueleto é a etapa 3, e ela anota a correção ao lado do
   `CONGELADO` com a data. Um esqueleto corrigido em silêncio é pior que
   um esqueleto errado: a etapa 6 confere o texto contra ele.
3. **Você fala do lugar da postura.** "Refiz a conta com a tarifa de
   setembro" quando a postura é quem refez a conta; "não testei este
   modelo; os números são da ficha técnica" quando não testou. Nunca finja
   teste.
4. **Um objeto, um nome.** O aparelho é "o split" o capítulo inteiro, não
   "o equipamento", "o dispositivo", "a máquina".
5. **Frase curta abre; a longa explica; a curta fecha.** Parágrafo de duas
   a cinco frases. Frase com mais de 45 palavras vira duas, ou vira lista
   se está enumerando. Parágrafo com mais de três números a comparar vira
   tabela, se o esqueleto previu; se não previu, vira duas frases.
6. **Número na prosa segue a precisão do `TOM.md`** (pergunta 6). Se o
   site lê arredondado, "R$ 9,01" vira "uns 9 reais" e "R$ 11,66" vira
   "quase 12"; o exato continua no dossiê, na tabela e na calculadora, e é
   isso que permite arredondar sem mentir. Arredondar nunca muda a ordem
   de grandeza nem o lado da comparação ("quase 10" para 9,01 sim; "10"
   seco, não; "9" para 9,99, não). Onde o `TOM.md` diz exato (conclusões,
   preço que o leitor paga, norma), exato.
7. **Ressalva é nomeada, não vaga.** "Depende" sozinho não entra. "Depende
   da temperatura configurada: a 24 °C o ciclo fica em torno de 40%, a
   20 °C passa de 60%" entra.
8. **O réu não é o leitor.** Quando o texto julga, julga a regra genérica,
   o vendedor, o senso comum. Sintoma de erro: segunda pessoa numa frase de
   julgamento ("você está gastando à toa").
9. **Nada de metadiscurso.** Sem "neste capítulo", "vale ressaltar",
   "é importante notar". Diga a coisa.
10. **Sigla expandida na primeira aparição do capítulo** (a etapa 5 poda as
   repetidas). Palavra técnica só se `LEITOR.md` diz que o leitor a usa;
   senão, a palavra dele com a técnica entre parênteses uma vez.
11. **Termina no fato.** Último parágrafo com o último número, a
    condição ou o próximo passo. Sem pergunta de arremate, sem aforismo.

## E no diário

Acrescente a entrada da etapa 4 em `posts/<peça>/diario.md` (gabarito
no fim do SKILL.md): feito, decidido (com a alternativa que perdeu),
descartado, adiado, travou em, tempo. Uma entrada por capítulo é demais; uma por sessão de redação basta,
listando os capítulos escritos e qualquer objeção levada ao esqueleto.

Gabarito desta entrada (acrescente ao diário; não substitua entradas):

```markdown
## <data> · etapa 4 · capitulos
**feito:** <arquivos e resultado>
**decidido:** <escolha, critério e alternativa que perdeu>
**descartado:** <item e motivo, ou nada>
**adiado:** <item e destino/condição, ou nada>
**travou em:** <obstáculo e encaminhamento, ou nada>
**tempo:** <duração medida, estimativa declarada ou não medido>
```

## Checagem antes de fechar o capítulo

- [ ] Entrada desta sessão de redação no `diario.md`, com os seis campos.
- [ ] Arquivo começa com o H2 idêntico ao esqueleto.
- [ ] Primeiro parágrafo contém a resposta do esqueleto com o dado ou a lacuna.
- [ ] Todo número do capítulo está no esqueleto, com a mesma marca.
- [ ] Só o bloco previsto no esqueleto, na sintaxe de `referencias/blocos.md`.
- [ ] Nenhum "como veremos" / "como vimos" / "neste capítulo".
- [ ] Nenhum link interno para slug que não é `publicado`.
- [ ] O dado próprio, se é deste capítulo, aparece com método e data.
- [ ] O capítulo não repete o que "não entra" diz que é de outro.

## Se travar

- A resposta do esqueleto não dá um parágrafo de pé porque falta contexto
  que só outro capítulo tem: escreva o parágrafo com o que este tem e
  deixe `[LIGAR: C3]` no fim da frase. A etapa 5 resolve.
- O dado do dossiê parece errado ao escrever: pare, escreva em "Objeções
  do redator" (capítulo, D, o que parece errado) e diga ao dono ou volte à
  etapa 3. Não escreva "cerca de" para disfarçar.
- Modelo pequeno com dificuldade de manter o tom: cole o parágrafo de
  amostra do `TOM.md` no topo do seu rascunho, escreva, e apague antes de
  salvar.
