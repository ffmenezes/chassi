/**
 * A URL absoluta de uma página deste site. Só formatação — nada mais.
 *
 * O domínio sai de `web/src/sites/<slug>.ts` e daqui só — a mesma doutrina de
 * `institucional/dados.ts`, que é o que faz o participante nunca precisar
 * abrir uma página jurídica. Por isso `astro.config.mjs` continua SEM `site:`:
 * a configuração do Astro é do upstream, o domínio é do participante, e juntar
 * os dois cria conflito exatamente onde o desenho do repositório existe para
 * não ter nenhum.
 *
 * As regras do `dominio` (vazio, com esquema, com barra final, com espaço) NÃO
 * moram aqui: são configuração do participante e por isso são conferidas em
 * `sites/validacao.ts`, uma vez por site no import, junto das outras regras
 * que quebram a build. Aqui ficaria conferindo o mesmo campo duas vezes por
 * página e deixaria de fora o site que não renderiza página nenhuma.
 *
 * A checagem que sobrou é de outra natureza: `caminho` é argumento NOSSO, de
 * chamada nossa. Caminho torto não é configuração errada do participante — é
 * bug nosso, e some assim que alguém corrige a chamada.
 */
import type { Site } from "./sites/tipos";

export function urlAbsoluta(site: Site, caminho: string): string {
  if (!caminho.startsWith("/")) {
    throw new Error(
      `[url] caminho sem barra inicial ("${caminho}"). A chamada e nossa: passe "/sobre/".`,
    );
  }

  return `https://${site.dominio}${caminho}`;
}
