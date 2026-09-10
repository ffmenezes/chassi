# `web/public/exemplo/`

O que mora aqui é **o vídeo de exemplo do inventário**, e ele existe pela
mesma razão que `web/src/imagens/exemplo/medicao.png`: sem um arquivo de
verdade, o espécime do bloco 32 mostraria uma moldura vazia, e moldura vazia
não deixa ninguém decidir se quer o bloco.

`medicao.mp4` tem 6 segundos, 640×360 e 33 KB. Ele é gerado, não filmado — a
tela diz "vídeo fictício do inventário" em cima, para que ninguém o confunda
com conteúdo publicável. É a mesma regra dos outros mocks: nada aqui carrega
nicho, domínio ou persona de site real.

**Este não é um acervo de vídeo.** Não existe acervo de vídeo neste
repositório, e onde o participante hospeda os vídeos dele é a mesma pergunta
em aberto que a das imagens (ver o `CLAUDE.md`). O `src` do bloco 32 é URL
livre — caminho absoluto do próprio site ou URL completa de um CDN —, e o
motivo está escrito no tipo `Origem`, em `web/src/video.ts`.

Uma consequência conhecida, e declarada para não virar surpresa:
`npm run inventario` achata a página num HTML sem requisição externa, mas
`scripts/inline.mjs` só inlina o que está em `/_astro/`. O `.mp4` daqui
continua sendo uma requisição, então no `inventario.html` solto o player do
bloco 32 aparece inteiro — moldura, controles, capa, legenda — e não toca.
Em `npm run dev` e no site publicado ele toca normalmente.
