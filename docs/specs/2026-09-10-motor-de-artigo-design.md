# Motor de artigo: o método em oito etapas

**Data:** 2026-09-10
**Estado:** skill escrita, validada por dois agentes Sonnet em dois sites de
teste; encanamento `post.md → blocos` continua fora de escopo
**Origem:** pedido do dono: documentar um método de criação de artigo que use
a estrutura de pastas do chassi, executável por modelo que não é de primeira
linha, com meta de 3 a 5 artigos por semana bem rankeáveis e de valor real.
Material de base: a skill `artigo` do repositório de origem (11 mil linhas,
dez fases, sete subagentes de gate), o acervo de creators (Will Binder, Luana
França, Bruno Faggion, Filipe Boni, News Makers, Brasa Certa), a atualização
de spam do Google de agosto de 2026 e quatro repositórios de "humanização".

## O problema

1. A skill de origem produziu quatro peças em agosto de 2026 e nenhuma
   publicada. Tem regras confiáveis (nasceram de erro real, com data), mas
   exige orquestrador com subagente cego em cinco gates, e um modelo sem
   despacho de subagente **para antes da fase 3 por desenho**. Para 3 a 5
   peças por semana, é lenta de ler e de executar.
2. O chassi tem `sites/<slug>/{base,estado,pautas,pesquisa,posts}` e os
   READMEs de `pautas/`, `pesquisa/` e `posts/`, mas nenhum método que ligue
   um ao outro: `posts/README.md` dizia "escreva onde preferir e não invente
   formato".
3. O código cita `.claude/skills/artigo/referencias/arquitetura-pagina.md`
   como autoridade e o arquivo não existe aqui.
4. Agosto de 2026: sites 100% IA derrubados pela política de "scaled
   content abuse"; um pipeline 100% IA subiu na mesma semana. A variável não
   é IA, é padrão de produção: volume fora do histórico, esqueleto repetido,
   URL programática, zero dado próprio, sem autor.

## As decisões

1. **Nome `artigo`, em `.agents/skills/artigo/`.** Resolve a citação do
   código e segue a convenção das três skills existentes. O spec de origem
   (`2026-09-04-chassi-design.md`, decisão 4) tinha deixado a skill `artigo`
   fora do chassi público. Esta é uma mudança consciente: o que vai para o
   público é o **método** (etapas, regras, travas), não o acervo de pesquisa
   nem os prompts de creator. O que continua privado é o material de origem.
2. **Oito etapas, um arquivo cada, autocontidas.** Ideias, pauta, dossiê,
   esqueleto, capítulos, costura, revisão, entrega. Cada arquivo diz o que
   ler, o que escrever (gabarito literal), regras numeradas, checagem sim/não
   e o que fazer quando travar. Modelo pequeno executa uma por invocação.
3. **Estado em disco, nenhuma pasta nova.** `pautas/_candidatas.md`
   (append), `pautas/<peça>.md`, `pesquisa/<peça>/dossie.md`,
   `posts/<peça>/{esqueleto.md, capitulos/, post.md, revisao.md}`. A
   descoberta da etapa é por `ls`, não por memória.
4. **Escuta funde no dossiê**; os sete subagentes viram três passes escritos
   na etapa 6 (rastreabilidade, texto de máquina, leitor cético) com
   veredito em disco e teto de três rodadas. "Quem escreveu não revisa" fica
   como regra de despacho quando há despacho, e como ordem de leitura quando
   não há.
5. **Seis plantas por verbo do leitor** (entender, executar, escolher,
   decidir, reagir, conferir) no lugar de dez fórmulas e cinco plantas. A regra 8
   ("dois artigos do mesmo site não repetem o esqueleto de H2") é a defesa
   contra template, e a planta é a ordem, não o molde.
6. **Sintaxe de bloco por diretiva de contêiner** (`:::nome{attr}`), formato
   de `remark-directive`. É o contrato do parser que não existe; escrever
   nela hoje evita reescrever peça depois. Frontmatter espelha `DadosArtigo`
   de `web/src/mock/artigos.ts`.
7. **Antipadrões calibrados para PT-BR**, com lista dura (grep, zero
   tolerância), lista de julgamento (só em aglomerado) e freio (em empate,
   deixa). Absorvido do humanizer v3 e do stop-slop; recusados o
   `humanize-text` (lavagem por tradução) e a parte estatística do
   `watermarks-remover`. Só a higiene Unicode virou script
   (`scripts/higiene-texto`).
8. **Ritmo como regra editorial**: lote de ideias por semana, uma peça por
   vez, um pilar por cluster, um veredito por mês, atualizar antes de
   publicar mais, volume proporcional ao histórico.

9. **O toque do autor é skill à parte (`pitaco`)**, aplicada depois da peça
   de pé: classifica o que o dono disse em opinião, experiência ou
   ressalva, encaixa no capítulo do assunto depois do dado, nunca na
   abertura, nas conclusões ou na FAQ, e passa número pelo dossiê. Até
   três por peça; a partir do quarto é peça de relato.
10. **O processo fica em disco**: `posts/<peça>/diario.md`, uma entrada por
    etapa com feito, decidido (e a alternativa que perdeu), descartado,
    adiado, travou em, tempo. As candidatas ganham o estado `adiada` e a
    linha "escolhida para a próxima peça, porque".

11. **Bloco por sinal de conteúdo, não por gosto.**
    `referencias/quando-cada-bloco.md` mapeia o que o esqueleto tem (três
    itens com atributos, dois lados na mesma base, ações em ordem, frase
    literal, consequência irreversível) ao bloco que o apresenta, com a
    condição, o "quando não" e um orçamento por peça (um bloco de dado por
    capítulo, um de cada família fora de pilar). O bloco 31, Gráfico, nasceu
    junto: barra, linha e pizza, SVG na build, hachura além da cor, tabela
    dentro do bloco, travas puras em `web/src/grafico.ts`.

12. **Link é do dono.** A etapa 7 gera `posts/<peça>/links.md`
    (`scripts/listar-links`): todo link do corpo com tipo e a coluna de
    decisão vazia (manter, trocar por afiliado, trocar a fonte, remover).
    `publicado` só depois de decidido; afiliado exige a declaração de
    `DECLARACOES.md`.
13. **Precisão de número é voz do site.** `base/TOM.md` ganhou a pergunta 6
    (exato ou arredondado na prosa, e onde o exato é obrigatório); a etapa
    4 aplica e a etapa 6 aceita o arredondado quando o exato está na
    tabela ou na calculadora da mesma peça.

## O que fica de fora, e onde está registrado

- Parser `post.md → Slot[]`, lugar das imagens do participante, leitura de
  `base/AUTOR.md` pelo bloco 22: pendências nomeadas em
  `referencias/blocos.md` e listadas pela etapa 7.
- Manutenção de peça publicada (re-apuração por `vence primeiro`): a etapa 7
  registra o gatilho no `CLUSTER.md`; o procedimento é etapa futura.
- Auditoria de voz trimestral, schema JSON-LD, distribuição social: fora.
- Métricas e calendário: `estado/` continua vazio, como o `_modelo` diz.

## Validação

Quatro agentes Sonnet, sem acesso ao material de origem, criaram
`sites/arnaconta`, `sites/pedalcomfio`, `sites/meinapratica` e
`sites/sublimalucro` a partir do `_modelo`, responderam os stubs, rodaram a etapa 0 com mais de vinte
candidatas e uma peça pelas etapas 1 a 7. Notas: 7 e 6 na primeira rodada
(régua livre), 9 na segunda e 7 na terceira (régua explícita: zero
contradição, zero passo faltando, até dois pontos de analogia); depois das
correções, as quatro reavaliadas em 9. Os sites de teste não entram no
repositório: são material do dono, ficam fora do commit. O relatório de cada um (o que ficou ambíguo, o que a skill
afirma e o repositório contradiz, onde um modelo pequeno travaria) alimentou
a rodada de correção da skill feita no mesmo dia (os dois relatórios
estão resumidos na seção "Os erros que já aconteceram" do SKILL.md).
