import { describe, expect, it } from "vitest";
import { dataRfc822, montarRss } from "./rss";
import type { Site } from "./sites/tipos";

const site: Site = {
  slug: "s", nome: "Blog & Cia", dominio: "exemplo.com.br", estilo: "linho",
  modoPadrao: "claro", blocos: [], muroDeEmail: false, emailContato: "c@s.com",
  responsavel: { nome: "Fulano", tipo: "pf" },
};

describe("dataRfc822", () => {
  it("dia da semana certo, meio-dia GMT, sem escorregar de dia", () => {
    expect(dataRfc822("2026-07-18")).toBe("Sat, 18 Jul 2026 12:00:00 GMT");
    expect(dataRfc822("2026-01-01")).toBe("Thu, 01 Jan 2026 12:00:00 GMT");
  });

  it("recusa data fora de YYYY-MM-DD", () => {
    expect(() => dataRfc822("18/07/2026")).toThrow(/YYYY-MM-DD/);
  });
});

describe("montarRss", () => {
  const xml = montarRss(site, [
    { slug: "antigo", titulo: "Antigo", descricao: "a", atualizado: "2026-01-10" },
    { slug: "novo", titulo: "<Novo> & \"aspas\"", descricao: "Wi-Fi & cabo", atualizado: "2026-07-18" },
  ]);

  it("escapa título e descrição", () => {
    expect(xml).toContain("<title>Blog &amp; Cia</title>");
    expect(xml).toContain("<title>&lt;Novo&gt; &amp; &quot;aspas&quot;</title>");
    expect(xml).toContain("<description>Wi-Fi &amp; cabo</description>");
    expect(xml).not.toMatch(/<title><Novo>/);
  });

  it("links absolutos, e o mais recente primeiro", () => {
    expect(xml).toContain("<link>https://exemplo.com.br/novo/</link>");
    expect(xml.indexOf("/novo/")).toBeLessThan(xml.indexOf("/antigo/"));
    expect(xml).toContain('href="https://exemplo.com.br/rss.xml" rel="self"');
  });

  it("lastBuildDate é a do artigo mais recente", () => {
    expect(xml).toContain("<lastBuildDate>Sat, 18 Jul 2026 12:00:00 GMT</lastBuildDate>");
  });
});
