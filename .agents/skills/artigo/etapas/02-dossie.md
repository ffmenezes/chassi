# Etapa 2 — Dossiê

Caminhos: `sites/`, `web/` e `scripts/` partem da raiz do checkout do
chassi; `referencias/` parte de `.agents/skills/artigo/`. `base/`,
`estado/`, `pautas/`, `pesquisa/` e `posts/` abreviados partem de
`sites/<slug>/`. Rode scripts da raiz, com o caminho completo da peça.
Site novo exige o par de cópias descrito em `sites/_modelo/README.md`.

Junta, num arquivo só, tudo o que a peça pode afirmar: cada dado com
fonte, data e o que ele **não** diz; o vocabulário com que o leitor fala do
assunto; as perguntas que ele faz de verdade; e ao menos um dado que nós
mesmos geramos. Quem redige depois só pode usar o que está aqui.

O dossiê não é texto. É feio de propósito: blocos numerados, campos fixos,
nada de prosa ligando um ao outro.

## Leia só isto

- `sites/<slug>/pautas/<peça>.md` — a tese, as três formas de estar errada
  e "o que ainda falta descobrir" são o roteiro de busca.
- `sites/<slug>/base/PROVAS.md` — onde apurar neste nicho. Comece por aqui,
  não por busca aberta.
- `sites/<slug>/base/EDITORIAL.md` — que afirmação nunca entra sem fonte.
- `sites/<slug>/estado/CLUSTER.md` — a linha cujo status será atualizado.
- `sites/<slug>/pesquisa/*.md` fora de pastas de peça — dados transversais
  já apurados (tarifa, norma). Reaproveite com a marca `[HERDADO]`.

## Escreva só isto

`sites/<slug>/pesquisa/<peça>/dossie.md`. Prints, PDFs e planilhas ficam
na mesma pasta, com nome descritivo. Ao terminar, mude o status da linha
da peça no `CLUSTER.md` para `dossie`.

```markdown
# Dossiê — <slug da peça>

**pauta:** pautas/<peça>.md
**aberto em:** 2026-09-10
**vence primeiro:** D3 (tarifa), na próxima revisão tarifária, ~2027-06

## Dados

### D1 — Tarifa residencial B1, bandeira verde, Enel SP
**valor:** R$ 0,89 / kWh com impostos
**marca:** [FONTE]
**fonte:** https://... (link direto para a tabela ou PDF, não para a home)
**publicado em:** 2026-07-01
**consultado em:** 2026-09-10
**classe da fonte:** órgão regulador
**validade:** perecível — revisão anual
> "frase literal da fonte que sustenta o valor, copiada, não parafraseada"
**o que este dado NÃO diz:** não inclui bandeira amarela nem tarifa branca;
vale para SP, não para outras distribuidoras.

### D2 — Consumo de um split 9.000 BTU inverter em ciclo de 8 h
**valor:** 0,9 a 1,4 kWh por noite
**marca:** [ESTIMATIVA] sobre D5 (potência nominal) × ciclo de 40 a 60%
**conta:** 0,75 kW × 8 h × 0,15 a 0,23 = 0,9 a 1,4 kWh
**consultado em:** 2026-09-10
**o que este dado NÃO diz:** depende de isolamento e temperatura externa;
a faixa é para 24 °C configurado.

### D3 — Preço praticado do modelo X em duas lojas
**valor:** R$ 1.899 e R$ 2.049
**marca:** [FONTE] (dado próprio: apuração de preço em 2026-09-10)
**fonte:** https://loja-a/... e https://loja-b/...
**método:** página do produto aberta, preço à vista, sem cupom
**publicado em:** não declarada
**consultado em:** 2026-09-10
**classe da fonte:** varejo — sustenta só preço praticado
**validade:** perecível — 90 dias
**frases literais:**
> Loja A: "<nome do produto e preço copiados da página A>"
> Loja B: "<nome do produto e preço copiados da página B>"
**o que este dado NÃO diz:** frete e parcelamento mudam o valor.

### D4 — <o que não se achou>
**marca:** [SEM DADO]
**onde procurou:** ANEEL, Inmetro, dois fabricantes (links)
**consequência:** a pergunta 4 do contrato vai declarar a lacuna, não
estimar.

## Dado próprio
Qual é: D3.
Método e data: preço em duas lojas, 2026-09-10, à vista, sem cupom.

## O que o leitor diz
Cinco a dez frases literais, com origem (fórum, comentário, "também
perguntam"), sem nome de pessoa. Sem frase literal em vinte minutos de
busca: escreva "nenhuma frase literal encontrada; procurado em <onde>" e
siga. Frase "representativa" inventada é o pior dos dois erros:
- "meu ar fica ligado a noite toda e a conta veio 300" (grupo público, 2026-08)
- ...
Objeções que aparecem ao menos três vezes: ...
Palavras que ele usa e que o site não usaria: ...

## Perguntas que ele faz (candidatas a FAQ)
Três a seis, literais.

## Fontes abertas
| id | URL | status | consultado em |
|---|---|---|---|
| D1 | https://... | 200 | 2026-09-10 |
| D3a | https://... | 200 | 2026-09-10 |

## Ataque à tese, depois de apurar
Para cada uma das três formas de estar errada da pauta: derrubou, ajustou
ou ficou de pé, e qual dado decidiu. Se a tese ajustou, escreva a versão
nova aqui; a etapa 3 lê esta, não a da pauta.
```

## As marcas, e o que cada uma pode sustentar

| marca | o que é | entra em conta? | entra em título/tabela? |
|---|---|---|---|
| `[FONTE]` | página aberta, com URL exata, data e frase literal; ou cálculo exato que remete aos D dessas entradas | sim | sim |
| `[ESTIMATIVA]` | conta sobre dados `[FONTE]`, com a conta escrita | sim, como faixa | sim, como faixa com data |
| `[PREMISSA]` | valor de exemplo onde há `[SEM DADO]`, rotulado no texto | só em exemplo rotulado | não |
| `[SEM DADO]` | procurou e não achou; diz onde procurou | não | não; a lacuna é declarada |
| `[HERDADO]` | dado de outro arquivo de `pesquisa/`, com a marca de lá | herda | herda |
| `[SNIPPET]` | resumo de busca, página **não** aberta | **nunca** | **nunca** |

`[SNIPPET]` só existe como lembrete de onde procurar. Resultado de
ferramenta de busca (WebSearch, resumo de busca, resposta que cita vários
sites) é sempre `[SNIPPET]`, mesmo quando nomeia o site e o número: só a
página aberta por URL (WebFetch, curl, navegador) vira `[FONTE]`. Vira `[FONTE]`
abrindo a página, ou vira `[SEM DADO]`. Nunca vira `[ESTIMATIVA]`.

## Regras

1. **Uma URL, nunca a busca.** A fonte é a página que sustenta o dado, com
   link direto ao PDF ou à tabela. "Google" não é fonte; "site da ANEEL"
   não é fonte.
2. **Duas datas por dado**: quando foi publicado e quando você abriu.
   Fonte sem data visível entra como `publicado em: não declarada`;
   nunca invente a data de publicação. Preço observado pode dizer
   "consultado em <data>", com método e frase literal: a data é da
   coleta, não da publicação da página. "Publicado em 2026" só quando
   a fonte informa isso.
3. **Frase literal entre aspas** em todo dado `[FONTE]`. É o que permite à
   etapa 6 conferir sem reabrir a página.
4. **Classe da fonte decide o que ela sustenta.** Órgão, norma, fabricante
   (ficha técnica) sustentam fato técnico. Varejo sustenta só preço
   praticado. Blog, afiliado e quem vende o kit não sustentam nada; entram
   como pista de onde procurar. Estudo citado por terceiro não é fonte;
   suba até o original.
   Ficha atribuída ao fabricante mas hospedada em loja é pista para
   localizar o documento oficial: o domínio da loja, o logo e a palavra
   "original" não comprovam a autoria técnica. Sem original verificável,
   o dado técnico fica `[SEM DADO]`; o preço da loja continua utilizável.
   Em suprimento e produto com variantes, registre o código exato: nome
   de família igual não prova SKU, volume, rendimento ou capacidade iguais.
5. **Repetição não é confirmação.** Três páginas com o mesmo número sem
   origem comum são uma fonte só, e ainda não achada.
6. **Apure exato, preserve a natureza do dado.** Preços ou consumo que
   variam na amostra podem sair como faixa, com mês e ano. Valor fixado em
   norma, prazo legal e medição única não viram faixa inventada. A precisão
   da prosa segue `base/TOM.md`; o exato permanece no dossiê, na tabela e
   na calculadora. Ao arredondar uma faixa, só alargue seus limites.
7. **Percentual carrega a base.** Todo `%` no dossiê diz "de quê". Duas
   bases diferentes na mesma peça: a regra prática sai em R$ por unidade.
8. **Amostra publicada é amostra coletada.** Se apurou 16 preços, a tabela
   tem 16 ou declara quantos ficaram fora e por quê.
9. **Arredondamento sobe** em conta que decide quantidade discreta (3,26
   módulos são 4; 2,1 latas são 3). Valor contínuo (reais, kWh, horas)
   não se arredonda para cima: publica com a precisão da fonte ou vira
   faixa. R$ 26,04 é R$ 26, não R$ 27.
10. **Link morto.** 404 ou domínio sem DNS: a fonte não existe; tente
    `web.archive.org` e, se achar, anote "snapshot de <data>". 403 de
    bloqueio: existe, anote a ressalva. **Fonte que a leitura de página não devolve** (PDF que vem como
    binário, HTML que cai com erro de conexão, página que a ferramenta
    não abre): baixe o arquivo (`curl -L -o fonte.pdf <URL>`, ou `.html`)
    e extraia o texto
    (`pdftotext fonte.pdf -` ou `python3 -c 'import pypdf,sys; ...'`);
    guarde o PDF na pasta da peça. Se nem assim o texto sai, é
    `[SEM DADO]` com "PDF ilegível em <data>". Nunca cite a norma pelo
    resumo que um blog fez dela.
11. **Terceiro localiza, primário sustenta.** Blog, associação e portal
    de notícia servem para descobrir qual é o artigo, a tabela ou a página
    oficial. O que entra no dossiê é a página oficial aberta; o terceiro
    fica anotado em "onde procurou", não em `fonte`.
12. **Quando parar.** Uma pergunta do contrato está apurada quando a fonte
    primária foi aberta e a terceira fonte independente só repete a
    segunda. Mais busca depois disso é custo sem dado. Se em vinte
    minutos nenhuma fonte primária aparece, vale a regra seguinte.
13. **Vinte minutos por linha de busca.** Sem sinal em vinte minutos,
    troque o ângulo (vocabulário da época, quem reclamou em vez de quem
    fez, o que existia antes). Ausência também é dado: vira `[SEM DADO]`
    com onde procurou. Nunca "historicamente" ou "desde sempre".
14. **O dado próprio é obrigatório.** Preço em duas lojas hoje, norma lida
    no texto oficial (com o artigo citado), simulador rodado com os
    parâmetros anotados, medição. Sem ele, a peça para aqui. Em peça
    comparativa, o dado próprio é um preço por candidato, na mesma data e
    no mesmo tipo de loja (dois modelos, uma loja cada, não vale: a
    diferença pode ser da loja).
15. **Ninguém escreve sobre imagem que não abriu.** Print que vai virar
    figura fica na pasta com um `.md` do lado dizendo legenda, fonte e data.

## E no diário

Acrescente a entrada da etapa 2 em `posts/<peça>/diario.md` (gabarito
no fim do SKILL.md): feito, decidido (com a alternativa que perdeu),
descartado, adiado, travou em, tempo. O que mais vale registrar aqui: fonte descartada por classe, tese
ajustada, dado que exigiria dias e ficou como pedido.

Gabarito desta entrada (acrescente ao diário; não substitua entradas):

```markdown
## <data> · etapa 2 · dossie
**feito:** <arquivos e resultado>
**decidido:** <escolha, critério e alternativa que perdeu>
**descartado:** <item e motivo, ou nada>
**adiado:** <item e destino/condição, ou nada>
**travou em:** <obstáculo e encaminhamento, ou nada>
**tempo:** <duração medida, estimativa declarada ou não medido>
```

## Checagem antes de fechar

- [ ] Entrada desta etapa no `diario.md`, com os seis campos.
- [ ] Toda pergunta do contrato tem ao menos um dado `[FONTE]` ou um
      `[SEM DADO]` explícito.
- [ ] Todo `[FONTE]` de coleta tem URL direta, duas datas, classe e frase
      literal; todo cálculo aponta os D de entrada com esses campos,
      registra expressão, unidade, data e incerteza herdada.
- [ ] Toda `[ESTIMATIVA]` tem a conta escrita e só usa dados `[FONTE]`.
- [ ] Não existe `[SNIPPET]` sustentando nada.
- [ ] A seção "Dado próprio" nomeia um D com método e data.
- [ ] "O que o leitor diz" tem ao menos cinco frases literais, ou a
      ausência e os lugares procurados após vinte minutos estão registrados.
- [ ] "Ataque à tese" responde às três formas de estar errada.
- [ ] `vence primeiro` aponta um D e um mês.
- [ ] Status no `CLUSTER.md` mudou para `dossie`.

## Se travar

- A tese caiu na apuração e nenhuma versão ajustada fica de pé: mude o
  status no `CLUSTER.md` para `descartada`, escreva o motivo na prosa do
  `CLUSTER.md`, e pare. Foi barato descobrir agora.
- Não há como obter o dado próprio em menos de duas horas: registre o que
  seria necessário e pergunte ao dono. Não substitua por `[ESTIMATIVA]`.
- A fonte oficial está atrás de bloqueio: anote em "Fontes abertas" com o
  status e siga com as outras; a lacuna se declara no texto.
