# O fluxo, em um diagrama

O que cada etapa lê, o que escreve, o status que muda no `CLUSTER.md`, e as
voltas previstas. A autoridade continua sendo cada arquivo em `etapas/`;
isto é o mapa para ver tudo de uma vez.

```mermaid
flowchart TD
    subgraph base["sites/<slug>/base/ e estado/ (o site, muda devagar)"]
        B1[TERRITORIO · LEITOR · META]
        B2[TOM · POSTURAS · AUTOR · EDITORIAL · DECLARACOES]
        B3[PROVAS · CONCORRENTES · MONETIZACAO]
        CL[(estado/CLUSTER.md<br/>slug · query-alvo · status)]
    end

    E0["Etapa 0 · Ideias<br/>5 geradores → 5 cortes em cascata"]
    C0[/pautas/_candidatas.md<br/>append por rodada: passou · corte N · adiada<br/>escolhida para a próxima peça, porque/]

    E1["Etapa 1 · Pauta<br/>tese afirmativa · 3 formas de estar errada<br/>contrato de 5 a 8 perguntas · verbo → planta"]
    P1[/pautas/&lt;peça&gt;.md/]
    D0[/posts/&lt;peça&gt;/diario.md<br/>nasce aqui; uma entrada por etapa/]

    E2["Etapa 2 · Dossiê<br/>um bloco por dado: fonte · datas · frase literal · o que NÃO diz<br/>dado próprio obrigatório · o que o leitor diz"]
    P2[/pesquisa/&lt;peça&gt;/dossie.md/]

    E3["Etapa 3 · Esqueleto<br/>H2 por pergunta, na ordem da planta<br/>resposta citável · dados D · bloco por sinal de conteúdo<br/>contas refeitas → CONGELADO"]
    P3[/posts/&lt;peça&gt;/esqueleto.md/]

    E4["Etapa 4 · Capítulos (loop)<br/>um arquivo por H2, contexto curto<br/>número só do esqueleto, com a marca"]
    P4[/posts/&lt;peça&gt;/capitulos/NN-*.md/]

    E5["Etapa 5 · Costura<br/>monta · resolve marcas · liga · poda<br/>medir-texto: ritmo até a régua"]
    P5[/posts/&lt;peça&gt;/post.md<br/>+ Fontes + Como esta peça foi feita/]

    E6["Etapa 6 · Revisão (quem escreveu não revisa)<br/>passe 1 rastreabilidade · passe 2 texto de máquina + aberturas<br/>passe 3 leitor cético · higiene · medição<br/>correção cirúrgica, 3 rodadas no máximo"]
    P6[/posts/&lt;peça&gt;/revisao.md<br/>VEREDITO por rodada/]

    E7["Etapa 7 · Entrega<br/>travas da build · blocos do site · autor · datas"]
    P7[/posts/&lt;peça&gt;/links.md<br/>todo link, coluna 'decisão do dono' vazia/]

    DONO{{"O dono decide o links.md<br/>manter · afiliado · trocar fonte · remover"}}
    PUB[["publicado<br/>a página no ar (parser post.md → blocos ainda não existe)"]]
    PIT["skill pitaco<br/>opinião · experiência · ressalva do autor<br/>no capítulo do assunto, sem mexer em número"]
    MAN["manutenção<br/>reabre quando 'vence primeiro' chega"]

    B1 & B3 & CL --> E0 --> C0
    C0 -->|uma aprovada| E1
    B2 --> E1
    E1 --> P1 & D0
    E1 -->|status pauta| CL
    P1 --> E2 --> P2
    E2 -->|status dossie| CL
    E2 -.->|tese cai| DESC[descartada, motivo na prosa]
    P1 & P2 --> E3 --> P3
    E3 -->|status esqueleto| CL
    P3 --> E4 --> P4
    E4 -->|status rascunho| CL
    E4 -.->|"objeção do redator<br/>(número, data, nome)"| E3
    P4 & P3 --> E5 --> P5
    P5 --> E6 --> P6
    E6 -->|status revisado| CL
    E6 -.->|devolvido| E2
    E6 -.->|devolvido| E3
    E6 -.->|"REVER de ritmo"| E5
    P5 & P6 --> E7 --> P7
    E7 -->|status pronto| CL
    P7 --> DONO --> PUB
    PUB --> PIT
    PUB --> MAN
    MAN -.->|dado vencido| E2
    E1 & E2 & E3 & E4 & E5 & E6 & E7 -.-> D0

    classDef etapa fill:#1f6f5a,stroke:#134a3c,color:#fff
    classDef arquivo fill:#f3f4f0,stroke:#9aa39e,color:#1a1d1b
    classDef dono fill:#f6e4d9,stroke:#b85c2e,color:#1a1d1b
    class E0,E1,E2,E3,E4,E5,E6,E7 etapa
    class C0,P1,P2,P3,P4,P5,P6,P7,D0 arquivo
    class DONO,PUB dono
```

Legenda: retângulo verde é etapa; caixa clara é arquivo em disco; seta
cheia é o caminho normal; seta tracejada é volta prevista. As oito etapas
escrevem no diário; a linha tracejada de todas para ele foi deixada uma
só para o desenho não virar teia. O que muda o status no `CLUSTER.md`
está na seta: 1, 2, 3, 4, 6 e 7; a etapa 5 não muda status, e
`publicado` é o dono.
