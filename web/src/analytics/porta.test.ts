import { describe, expect, it } from "vitest";
import { analyticsDoSite, ADAPTADORES } from "./porta";
import type { Site } from "../sites/tipos";

const site = (analytics?: Site["analytics"], analyticsId?: string): Site => ({
  slug: "t", nome: "T", dominio: "t.com", estilo: "linho", modoPadrao: "claro",
  blocos: [], muroDeEmail: false, emailContato: "a@t.com",
  responsavel: { nome: "F", tipo: "pf" }, analytics, analyticsId,
});

describe("analyticsDoSite", () => {
  it("sem declaracao, cai em nenhum", () => {
    expect(analyticsDoSite(site()).id).toBe("nenhum");
  });

  it("nenhum nao usa cookie e nao emite script", () => {
    const a = analyticsDoSite(site("nenhum"));
    expect(a.usaCookie).toBe(false);
    expect(a.clausulas).toEqual([]);
    expect(a.script("")).toBeNull();
  });

  it("cloudflare nao usa cookie", () => {
    expect(analyticsDoSite(site("cloudflare", "tok")).usaCookie).toBe(false);
  });

  it("ga4 usa cookie e declara pelo menos uma clausula", () => {
    const a = analyticsDoSite(site("ga4", "G-XYZ"));
    expect(a.usaCookie).toBe(true);
    expect(a.clausulas.length).toBeGreaterThan(0);
  });

  it("ga4 sem id nao emite script", () => {
    expect(analyticsDoSite(site("ga4")).script("")).toBeNull();
  });

  it("ga4 com id poe o id no script", () => {
    expect(analyticsDoSite(site("ga4", "G-XYZ")).script("G-XYZ")).toContain("G-XYZ");
  });

  it("posthog usa cookie e declara clausula", () => {
    const a = analyticsDoSite(site("posthog", "phc_x"));
    expect(a.usaCookie).toBe(true);
    expect(a.clausulas.length).toBeGreaterThan(0);
  });

  it("todo adaptador declara clausula se e so se usa cookie", () => {
    for (const a of Object.values(ADAPTADORES)) {
      expect(a.usaCookie).toBe(a.clausulas.length > 0);
    }
  });
});
