import { describe, expect, it } from "vitest";
import { renderizarResponsavel } from "./dados";

describe("renderizarResponsavel", () => {
  it("pessoa juridica mostra o CNPJ", () => {
    const t = renderizarResponsavel({ nome: "Acme LTDA", tipo: "pj", documento: "12.345.678/0001-90" });
    expect(t).toContain("Acme LTDA");
    expect(t).toContain("12.345.678/0001-90");
  });

  it("pessoa fisica NUNCA mostra o CPF, mesmo declarado", () => {
    const t = renderizarResponsavel({ nome: "Fulano", tipo: "pf", documento: "123.456.789-00" });
    expect(t).toContain("Fulano");
    expect(t).not.toContain("123.456.789-00");
    expect(t).not.toContain("789");
  });

  it("pessoa juridica sem documento nao inventa nada", () => {
    expect(renderizarResponsavel({ nome: "Acme", tipo: "pj" })).toBe("Acme");
  });
});
