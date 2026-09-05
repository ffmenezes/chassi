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
 * CPF exposto em página indexada é convite a fraude, e a LGPD não exige
 * documento nenhum para identificar o controlador — nome e canal de contato
 * bastam. Por isso o CPF é aceito na configuração e NUNCA renderizado, em
 * função nenhuma das duas abaixo, ligado o campo do rodapé ou não: o gate de
 * `r.tipo === "pj"` é o mesmo nas duas, e não existe caminho que o contorne.
 *
 * A página jurídica e o rodapé, porém, têm necessidades diferentes quanto ao
 * CNPJ. Na jurídica ele aparece sempre que for PJ: é a página que existe para
 * identificar o controlador, e quem chegou ali está procurando exatamente
 * isso — é o que Ads e Meta esperam encontrar. No rodapé, que repete a
 * identificação em TODA página do site, o CNPJ é registro público mas também
 * é chave de busca: a Receita devolve o endereço registrado da empresa, que
 * para MEI ou empresa de uma pessoa só é quase sempre a casa do dono.
 * Mostrar o CNPJ ali é publicar esse endereço em toda página, com um passo
 * de indireção — daí o rodapé só mostrar quando `mostrarDocumentoNoRodape`
 * está ligado (site que vende, ou dono que quer o sinal de legitimidade); a
 * LGPD e o AdSense já se contentam com nome e e-mail.
 *
 * Duas funções, não uma com parâmetro booleano: cada chamador sabe pelo
 * próprio papel — página jurídica ou rodapé — qual regra é a dele, sem
 * precisar decidir nada em tempo de execução. Um parâmetro ali só moveria a
 * mesma decisão para o call site, sem ganhar nada.
 */
function comDocumento(r: Responsavel, documentoLigado: boolean): string {
  if (r.tipo === "pj" && r.documento && documentoLigado) {
    return `${r.nome} — CNPJ ${r.documento}`;
  }
  return r.nome;
}

/** Para as quatro páginas jurídicas: documento de PJ aparece sempre. */
export function renderizarResponsavelJuridico(r: Responsavel): string {
  return comDocumento(r, true);
}

/** Para o rodapé: documento de PJ só aparece com o campo ligado no site. */
export function renderizarResponsavelRodape(r: Responsavel): string {
  return comDocumento(r, r.mostrarDocumentoNoRodape ?? false);
}

/**
 * A bifurcação que faz a política de cookies se ajustar sozinha ao adaptador
 * de analytics ativo: trocar `site.analytics` muda o que `cookies.astro`
 * renderiza, sem exigir edição nenhuma na página.
 */
export function cookiesDoSite(site: Site): ClausulaDeCookie[] {
  return analyticsDoSite(site).clausulas;
}
