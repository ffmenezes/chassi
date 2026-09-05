/**
 * As regras que quebram a build. Funções puras, sem glob e sem import de
 * ambiente, para que rodem no vitest sem Astro nem Vite.
 */
import type { Modo, Site } from "./tipos";

/**
 * O teto, e ele existe para ser incômodo antes de o problema aparecer.
 *
 * Site que sobrescreve acento E superfícies E fontes não é "vidro com uma
 * personalização": é um estilo novo usando vidro como atalho. Sem teto, daqui a
 * um ano existem três vidros irreconhecíveis entre si e nenhum deles é o vidro.
 */
export const TETO_DE_DESVIO = 6;

const FAMILIA_TIPOGRAFICA: string[] = ["--b-fonte-titulo", "--b-fonte-corpo", "--b-fonte-meta"];

/** Roda no build. Estourar o teto quebra a build, não vira aviso ignorado. */
export function validar(sites: Site[], estilosConhecidos: string[]): void {
  const vistos = new Set<string>();
  for (const site of sites) {
    if (vistos.has(site.slug)) {
      throw new Error(
        "[sites] slug repetido: \"" + site.slug + "\". Um slug, um arquivo, um site.",
      );
    }
    vistos.add(site.slug);

    if (!estilosConhecidos.includes(site.estilo)) {
      throw new Error(
        "[sites] " + site.slug + " usa o estilo \"" + site.estilo + "\", que não existe. " +
        "Os que existem: " + estilosConhecidos.join(", ") + ". " +
        "Para criar um novo, escreva src/styles/estilos/<nome>.css e <nome>.ts.",
      );
    }

    /*
     * O domínio é configuração do participante, e por isso é conferido AQUI,
     * uma vez por site no import, e não dentro de `url.ts` — lá a conferência
     * rodaria duas vezes por página, em toda página, e um site que não
     * renderiza página nenhuma nunca seria conferido. `og:url` relativo é card
     * que não abre, e descobrir isso no WhatsApp é caro demais perto de
     * descobrir no build.
     */
    const dominio = site.dominio.trim();
    const ondeArrumar = `Arrume em web/src/sites/${site.slug}.ts.`;
    if (!dominio) {
      throw new Error(
        `[sites] ${site.slug} está com dominio vazio. Sem ele não existe og:url nem ` +
          `canonical. ${ondeArrumar}`
      );
    }
    if (/^[a-z]+:\/\//i.test(dominio)) {
      throw new Error(
        `[sites] ${site.slug} declara dominio com esquema ("${site.dominio}"), e o ` +
          `og:url sairia dobrado. Escreva só o host: "exemplo.com.br". ${ondeArrumar}`
      );
    }
    if (dominio.endsWith("/")) {
      throw new Error(
        `[sites] ${site.slug} declara dominio com barra final ("${site.dominio}"). ` +
          `A barra vem do caminho, nunca do host. ${ondeArrumar}`
      );
    }
    if (/\s/.test(site.dominio)) {
      throw new Error(
        `[sites] ${site.slug} declara dominio com espaço ("${site.dominio}"). ` +
          `Host não tem espaço. ${ondeArrumar}`
      );
    }

    if (site.avisoBarra) {
      if (!site.avisoBarra.texto.trim()) {
        throw new Error(
          `[sites] ${site.slug} declara avisoBarra sem texto. Sem texto não há recado: ` +
            `ou o campo leva o aviso, ou o campo nem existe — apague avisoBarra em vez ` +
            `de deixar texto vazio.`
        );
      }
      if (Boolean(site.avisoBarra.linkHref) !== Boolean(site.avisoBarra.linkTexto)) {
        throw new Error(
          `[sites] ${site.slug} declara avisoBarra com linkHref ou linkTexto sem o outro. ` +
            `Os dois juntos, ou nenhum: destino sem rótulo visível não navega, e rótulo ` +
            `sem destino não é link.`
        );
      }
    }

    if (!site.tokens) continue;
    const usados = new Set<string>();
    for (const modo of Object.keys(site.tokens) as Modo[]) {
      for (const token of Object.keys(site.tokens[modo] ?? {})) {
        usados.add(token);
        if (FAMILIA_TIPOGRAFICA.includes(token)) {
          throw new Error(
            `[sites] ${site.slug} troca ${token}. Troca de família tipográfica não é ` +
              `desvio: vire um estilo próprio em src/styles/estilos/.`
          );
        }
      }
    }
    if (usados.size > TETO_DE_DESVIO) {
      throw new Error(
        `[sites] ${site.slug} sobrescreve ${usados.size} tokens, e o teto é ${TETO_DE_DESVIO}. ` +
          `Passou disso não é desvio sobre "${site.estilo}": é um estilo novo usando ` +
          `"${site.estilo}" como atalho. Crie src/styles/estilos/<nome>.css.`
      );
    }
  }
}

/** Vira o `<style>` que o layout emite, na camada `site`, que vence sempre. */
export function cssDoSite(site: Site): string {
  if (!site.tokens) return "";
  const regras: string[] = [];
  for (const modo of Object.keys(site.tokens) as Modo[]) {
    const decls = Object.entries(site.tokens[modo] ?? {})
      .map(([k, v]) => `${k}:${v}`)
      .join(";");
    if (!decls) continue;
    /* @layer site vence [data-estilo][data-modo] sem depender de especificidade */
    regras.push(`[data-site="${site.slug}"][data-modo="${modo}"]{${decls}}`);
  }
  return regras.length ? `@layer site{${regras.join("")}}` : "";
}
