# Antipadrões — o que denuncia texto de máquina, em português

Usado na etapa 6, passe 2. Não é lista para ler antes de escrever: quem
escreve desviando da lista produz texto que desvia, não texto que diz.

Três partes: a **lista dura** (grep, zero tolerância, corrige sempre), a
**lista de julgamento** (localizar por grep ou leitura, corrigir só em
aglomerado) e o **freio** (o que não é defeito, e vale mais que as duas
listas). Calibrada para PT-BR a partir do humanizer (Wikipedia, sinais de
escrita por IA), do stop-slop e da experiência de quatro peças em agosto
de 2026. O que é hábito legítimo em português ficou de fora.

## Lista dura

Rode do diretório da peça. Cada ocorrência é defeito.

```bash
# travessão, meia-risca, hífen duplo
grep -nE '—|–| -- ' post.md

# emoji e setas
grep -nP '[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}\x{2190}-\x{21FF}]' post.md

# metadiscurso e enchimento
grep -niE 'neste artigo|nesta seção|vamos (explorar|mergulhar|entender)|vale (ressaltar|destacar|lembrar)|é importante (notar|ressaltar|destacar)|dito isso|sem mais delongas|no fim do dia|nos dias de hoje|no mundo de hoje|em suma|em resumo,' post.md

# vocabulário de máquina (em grupo; um sozinho dentro de citação não conta)
grep -niE '\b(crucial|fundamental|robust[oa]|de ponta|sem atrito|empoderar|alavancar|potencializar|destravar|revolucionar|impulsionar|otimizar sua|solução completa|panorama|cenário atual|tapeçaria|testemunho de|meticulos[oa]|vibrante|imperdível|deslumbrante|renomad[oa]|vasta gama|no coração de)\b' post.md

# atribuição vaga = número sem origem
grep -niE 'especialistas (afirmam|apontam|recomendam|dizem)|estudos (mostram|indicam|apontam|comprovam)|sabe-se que|é sabido|diversas fontes|segundo pesquisas' post.md

# gatekeeping e falsa revelação
grep -niE 'ninguém (te|lhe) (conta|contou|fala)|o que não querem que você saiba|o segredo (que|da|do)|a verdade (que|sobre) .* escond' post.md

# sobra de chat
grep -niE 'espero que (ajude|tenha ajudado)|ótima pergunta|segue abaixo|claro!|quer que eu|como (um )?modelo de linguagem|até a minha data' post.md

# título case em H2 (Cada Palavra Maiúscula)
grep -nE '^## ([A-ZÀ-Ú][a-zà-ú]+ ){2,}[A-ZÀ-Ú]' post.md

# mais de um H1, ou H4
grep -nE '^# |^#### ' post.md
```

Falso positivo conhecido: "fundamental" em "direito fundamental",
"fundação"; "panorama" no nome do bloco `tabela-panorama`; "crucial"
dentro de citação literal. Não conte esses.

## Lista de julgamento

Localize por grep; corrija **só em aglomerado**: dois ou mais sinais no
mesmo parágrafo, ou o mesmo sinal três vezes na peça.

| padrão | como achar | por que denuncia | substituto |
|---|---|---|---|
| **Gerúndio de análise falsa** no fim da frase: "garantindo", "evidenciando", "refletindo", "contribuindo para", "possibilitando", "proporcionando", "reforçando" | `grep -nE ', (garantindo|evidenciando|refletindo|contribuindo|possibilitando|proporcionando|reforçando|destacando|consolidando)'` | Cola profundidade num fato simples. O tell mais forte em PT-BR | Corte a oração. Sumiu informação? Era frase: vire frase com fonte. Não sumiu? Era enfeite |
| **Fuga da cópula**: "serve como", "configura-se como", "consiste em", "conta com", "dispõe de", "figura como", "constitui", "apresenta" | `grep -nE '\b(serve como|configura-se|consiste em|conta com|dispõe de|figura como|constitui|apresenta um[a]?)\b'` | Verbo pomposo no lugar de "é" e "tem" | "é", "tem" (cuidado: "a conta com" em "a conta completa" é falso positivo) |
| **"Não é X, é Y"** e "não se trata de X" | `grep -nE 'não (é|se trata de|é sobre) .{3,40}, (é|mas) '` | Nega o que ninguém afirmou para inflar Y | Afirme Y. Mantenha o contraste só se X é crença real do leitor, nomeada |
| **Tríade forçada**: "rápido, seguro e barato" | leitura; `grep -nE '\w+, \w+ e \w+\.'` ajuda | Completude por forma | Dois itens, ou os que existem |
| **Fragmentos em série**: "Sem sinal. Sem opção. Sem saída." | `grep -nE '(\b\w+ \w+\. ){2,}'` | Ritmo de anúncio | Uma frase com a afirmação |
| **Fecho de efeito**: "É isso.", "Simples assim.", "Ponto final.", "Leia de novo." | `grep -nE '(É isso|Simples assim|Ponto final|Pense nisso|Leia de novo)\.'` | Pede pausa em vez de acrescentar fato | Terminar no último fato |
| **Aforismo de para-choque**: "X é o Y de Z", "a margem não some, ela escorre" | leitura | Frase feita vestida de sabedoria | A afirmação concreta |
| **Epifania e autotransformação**: "o que era hobby virou negócio", "fui A, sou B" | leitura | Arco narrativo fabricado | Cortar, ou o fato com data |
| **Discutir com ninguém**: "não estou dizendo que", "para ser claro", "alguns diriam" | `grep -niE 'não estou dizendo|para ser claro|alguns (diriam|podem dizer)|é claro que'` | Defende de objeção que ninguém fez | Cortar. Se há objeção real, ela tem nome e resposta (passe 3) |
| **Variação elegante**: o split, o aparelho, o equipamento, o dispositivo | leitura por objeto | O modelo evita repetir; gente repete o nome | Um objeto, um nome |
| **Qualificador empilhado**: "pode potencialmente, em alguns casos" | `grep -niE '(pode|poderia) (potencialmente|eventualmente|em alguns casos)'` | Incerteza acumulada por edição | Um "pode", ou o número |
| **Ressalva vaga empilhada**: "em geral", "dependendo", "costuma", "pode variar" três vezes no parágrafo | `grep -ncE 'em geral|dependendo|costuma|pode variar'` por parágrafo | Hedging que não informa | Uma ressalva nomeada (depende de quê, quanto) |
| **Voz passiva sem agente**: "foram feitos ajustes", "é recomendado" | `grep -nE '\b(foi|foram|é|são) (feit|recomendad|considerad|realizad)[oa]s?\b'` | Esconde quem fez | Quem fez; "você" quando não há pessoa |
| **Agência falsa**: "os dados nos dizem", "o mercado recompensa", "a conta revela" | leitura | Coisa faz verbo de gente para não nomear quem age | Nomear a pessoa, ou "você" |
| **Conexão vaga**: "associado a", "ligado a", "relacionado com" | `grep -niE 'associad[oa] a|ligad[oa] a|relacionad[oa] (a|com)'` | Esconde a relação real | Nomear a relação (causa, faz parte de, mede) |
| **Significado inflado**: "marca uma virada", "abre caminho", "momento decisivo", "o futuro é promissor" | `grep -niE 'marca uma virada|abre caminho|momento decisivo|futuro (é |está )?promissor|passo na direção certa'` | Detalhe comum vira marco | O fato, sem moldura |
| **Extremos preguiçosos**: sempre, nunca, todo mundo, ninguém | `grep -nwiE 'sempre|nunca|todo mundo|ninguém'` | Autoridade sem número | Número, caso, condição |
| **Abertura retórica**: "Sinceramente?", "Olha,", "Sabe o que", "A verdade é que" | `grep -niE '^(Sinceramente|Olha|Sabe o que|A verdade é que|Aqui está)'` | Anuncia em vez de fazer | Começar pelo ponto |
| **Clivada repetida**: "É esse detalhe que sustenta", "É essa regra que decide" | `grep -nE '\bÉ (ess[ea]s?|est[ea]s?|isso|aqui|por isso|daí) .{3,60} que\b'` | Ênfase por molde; uma vez é ênfase, quatro é tique | Sujeito e verbo: "Esse detalhe sustenta" |
| **Tese repetida quase igual** três ou mais vezes (fim de capítulo, abertura do seguinte, fechamento) | leitura; grep de um fragmento da tese | Reforço vira redundância | Uma vez na abertura, uma no fechamento; no meio, o dado |
| **Falsa faixa**: "da escolha do papel à gestão de estoque" | `grep -nE '\bd[oa] .{3,30} (à|ao) \b'` | Extremos que não formam escala | Listar os itens |

## Segunda ordem (só vê quem lê a peça inteira)

- **Personalidade só nas pontas**: abertura em primeira pessoa, miolo
  clínico, fechamento em primeira pessoa. Conte apartes por capítulo;
  capítulo longo com zero é o sintoma.
- **Três parágrafos que abrem igual** (mesmo sujeito, mesma construção).
- **Todos os H2 em pergunta**, ou todos em fragmento que o primeiro
  parágrafo repete.
- **Bullets do mesmo tamanho**, lista com rótulo em negrito seguido de
  dois-pontos que só reformula o rótulo.
- **Monotonia de cadência**: toda frase entre 15 e 25 palavras. Meça um
  capítulo; se não há frase curta nem longa, não há voz.
- **A mesma frase curta de gatilho** em três ou mais capítulos ("A
  diferença é o imposto.", "Só o INSS muda.", "A causa é a parcela."):
  sujeito curto, verbo ser, ponto. É o efeito colateral de perseguir a
  régua de frases curtas; a frase curta precisa variar de forma, não só
  existir.
- **Equilíbrio falso**: "por um lado... por outro" sem veredito.
- **Seção "desafios e perspectivas"** ou fechamento "o futuro é
  promissor".
- **Contradição de número entre seções** (a etapa 5 já grepou; confira).
- **Concessão que autoriza**: ressalva seguida de afirmação forte sem
  fonte ("embora varie, o ganho é de 40%").

## O freio

Vale mais que as listas. Um sinal isolado não é defeito. Não marque:

- prosa seca, registro misto, vocabulário técnico do nicho;
- frase curta de ênfase, uma vez;
- palavra da lista dentro de citação literal;
- "provavelmente", "raramente" e outros advérbios que carregam informação
  (o stop-slop proíbe todo advérbio; em português isso apaga o hedge
  honesto);
- aspas curvas (o site decide a convenção; não é sinal sozinho);
- um "no entanto" ou um "porém" por capítulo;
- "sempre", "nunca" e "todo" quando o número ou a condição já está na
  mesma frase ("todo mês, R$ 75,90"): o padrão é autoridade sem número,
  e ali o número está. Trocar por nada é movimento vazio.

Sinais de gente escrevendo, que **ficam**: detalhe difícil de inventar
(o modelo do medidor, a hora em que a loja abriu), resultado negativo
("não deu certo"), sentimento misto, parêntese de autocorreção, referência
datada. Em empate entre corrigir e deixar, deixa.

E "empate" não é sensação, é contagem: o padrão da lista de julgamento se
corrige quando aparece **duas vezes no mesmo parágrafo** ou **três vezes
na peça**. Abaixo disso, fica, mesmo que pareça feio. Acima disso,
corrige, mesmo que cada ocorrência pareça defensável. É a única maneira
de dois revisores chegarem ao mesmo resultado.

## O que a lista não faz

- Não "humaniza" inventando: nunca acrescente fato, nome, número, data ou
  citação para o texto soar pessoal. Sinal humano sem fonte é mentira.
- Não corre atrás de detector de IA: o Google não usa detector; usa padrão
  de produção (volume, template, valor). Texto lavado por tradução ou
  paráfrase para enganar detector não entra neste método.
- Não remove ressalva obrigatória por "soar mais direto". A ressalva
  nomeada é informação.
