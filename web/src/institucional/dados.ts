/**
 * O que as quatro páginas jurídicas leem para não ter dado literal no markup.
 *
 * Nome, domínio, e-mail e responsável saem todos daqui, e daqui só, porque é
 * o que faz o participante nunca precisar abrir `privacidade.astro`,
 * `cookies.astro`, `termos.astro` ou `direitos-autorais.astro`: ele edita a
 * configuração do site, e as quatro páginas se atualizam sozinhas. É esse o
 * ganho de fronteira — elas continuam recebendo correção do upstream para
 * sempre, porque nunca são o arquivo que o participante mexeu.
 */
import type { Site, Responsavel } from "../sites/tipos";
import { analyticsDoSite, type ClausulaDeCookie } from "../analytics/porta";
import { listaDeSites } from "../sites";

/**
 * O site institucional é o primeiro (e, no chassi de um workshop, o único)
 * site declarado em `src/sites/`. Lista vazia é configuração incompleta, não
 * caso de borda a tolerar: sem site nenhum, as páginas jurídicas não têm de
 * quem falar, e o erro tem de apontar o próximo passo, não só reclamar.
 */
export function siteInstitucional(): Site {
  const sites = listaDeSites();
  if (sites.length === 0) {
    throw new Error(
      "[institucional] nenhum site declarado em src/sites/. Copie src/sites/exemplo.ts " +
        "para <seu-slug>.ts e preencha os dados antes de buildar as páginas institucionais.",
    );
  }
  return sites[0];
}

/**
 * CNPJ é registro público e é o que Ads e Meta esperam ver. CPF exposto em
 * página indexada é convite a fraude, e a LGPD não exige documento nenhum para
 * identificar o controlador — nome e canal de contato bastam. Por isso o CPF
 * é aceito na configuração e NUNCA renderizado.
 */
export function renderizarResponsavel(r: Responsavel): string {
  if (r.tipo === "pj" && r.documento) {
    return `${r.nome} — CNPJ ${r.documento}`;
  }
  return r.nome;
}

/**
 * A bifurcação que faz a política de cookies se ajustar sozinha ao adaptador
 * de analytics ativo: trocar `site.analytics` muda o que `cookies.astro`
 * renderiza, sem exigir edição nenhuma na página.
 */
export function cookiesDoSite(site: Site): ClausulaDeCookie[] {
  return analyticsDoSite(site).clausulas;
}
