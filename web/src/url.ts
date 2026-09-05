/**
 * A URL absoluta de uma página deste site.
 *
 * O domínio sai de `web/src/sites/<slug>.ts` e daqui só — a mesma doutrina de
 * `institucional/dados.ts`, que é o que faz o participante nunca precisar
 * abrir uma página jurídica. Por isso `astro.config.mjs` continua SEM `site:`:
 * a configuração do Astro é do upstream, o domínio é do participante, e juntar
 * os dois cria conflito exatamente onde o desenho do repositório existe para
 * não ter nenhum.
 *
 * Falha em vez de emendar: `og:url` relativo é card que não abre, e descobrir
 * isso no WhatsApp é caro demais perto de descobrir no build.
 */
import type { Site } from "./sites/tipos";

const erro = (m: string) => {
  throw new Error(`[url] ${m}`);
};

export function urlAbsoluta(site: Site, caminho: string): string {
  const d = site.dominio.trim();

  if (!d) erro("dominio vazio em web/src/sites/<slug>.ts. Sem ele nao existe og:url.");
  if (/^[a-z]+:\/\//i.test(d)) {
    erro(`dominio com esquema ("${d}"). Escreva so o host: "exemplo.com.br".`);
  }
  if (d.endsWith("/")) {
    erro(`dominio com barra final ("${d}"). A barra vem do caminho, nao do host.`);
  }
  if (/\s/.test(d)) erro(`dominio com espaco ("${d}").`);
  if (!caminho.startsWith("/")) {
    erro(`caminho sem barra inicial ("${caminho}"). A chamada e nossa: passe "/sobre/".`);
  }

  return `https://${d}${caminho}`;
}
