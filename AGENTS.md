# chassi

Esqueleto de blog de nicho: Astro estático, 30 blocos, 5 estilos, páginas
institucionais. Escrito em português — doutrina, comentários, nomes de arquivo
e de variável. Mantenha assim.

## A fronteira

Você edita: `web/src/sites/<slug>.ts`, `web/src/meu/**`, `sites/**`.
O upstream edita: todo o resto.

Cara própria sai de **até 6 tokens** em `web/src/sites/<slug>.ts`, nunca de
editar um `.astro`. É essa regra que faz `scripts/atualizar` nunca conflitar.

## Comandos

    ./scripts/instalar        uma vez, após o clone
    ./scripts/atualizar       o que mudou no upstream x o que você tocou
    cd web && npm run dev     Astro em 4321
    cd web && npm run build
    cd web && npm test
