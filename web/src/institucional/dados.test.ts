import { describe, expect, it } from "vitest";
import { renderizarResponsavelJuridico, renderizarResponsavelRodape } from "./dados";

/**
 * Os quatro casos abaixo distinguem "regra correta" de "função quebrada que
 * nunca renderiza nada": cada teste falha se a regra específica dele quebrar,
 * não só se o documento sumir de algum jeito. Em especial os dois testes de
 * PJ usam a MESMA responsavel e comparam contra a MESMA string esperada nas
 * duas funções — não basta "não mostrar"; a jurídica precisa continuar
 * mostrando enquanto o rodapé some.
 */
describe("renderizarResponsavelJuridico", () => {
  it("PJ com mostrarDocumentoNoRodape LIGADO: a jurídica mostra o CNPJ do mesmo jeito", () => {
    const pj = { nome: "Acme LTDA", tipo: "pj" as const, documento: "12.345.678/0001-90", mostrarDocumentoNoRodape: true };
    expect(renderizarResponsavelJuridico(pj)).toBe("Acme LTDA — CNPJ 12.345.678/0001-90");
  });

  it("PJ com mostrarDocumentoNoRodape DESLIGADO (ou ausente): a jurídica mostra o CNPJ mesmo assim", () => {
    const semCampo = { nome: "Acme LTDA", tipo: "pj" as const, documento: "12.345.678/0001-90" };
    const comCampoFalso = { ...semCampo, mostrarDocumentoNoRodape: false };
    expect(renderizarResponsavelJuridico(semCampo)).toBe("Acme LTDA — CNPJ 12.345.678/0001-90");
    expect(renderizarResponsavelJuridico(comCampoFalso)).toBe("Acme LTDA — CNPJ 12.345.678/0001-90");
  });

  it("PF com documento preenchido: a jurídica NUNCA estampa, nem com o campo do rodapé ligado", () => {
    const pf = { nome: "Fulano", tipo: "pf" as const, documento: "123.456.789-00", mostrarDocumentoNoRodape: true };
    const t = renderizarResponsavelJuridico(pf);
    expect(t).toBe("Fulano");
    expect(t).not.toContain("123.456.789-00");
    expect(t).not.toContain("789");
  });

  it("PF sem documento: nome sozinho, sem sobra de separador", () => {
    expect(renderizarResponsavelJuridico({ nome: "Fulano", tipo: "pf" })).toBe("Fulano");
  });
});

describe("renderizarResponsavelRodape", () => {
  it("caso 1 — PJ com o campo LIGADO: o rodapé mostra o CNPJ", () => {
    const pj = { nome: "Acme LTDA", tipo: "pj" as const, documento: "12.345.678/0001-90", mostrarDocumentoNoRodape: true };
    expect(renderizarResponsavelRodape(pj)).toBe("Acme LTDA — CNPJ 12.345.678/0001-90");
  });

  it("caso 2 — PJ com o campo DESLIGADO (ou ausente): o rodapé NÃO mostra, mas a jurídica mostra", () => {
    const desligado = { nome: "Acme LTDA", tipo: "pj" as const, documento: "12.345.678/0001-90", mostrarDocumentoNoRodape: false };
    const ausente = { nome: "Acme LTDA", tipo: "pj" as const, documento: "12.345.678/0001-90" };

    expect(renderizarResponsavelRodape(desligado)).toBe("Acme LTDA");
    expect(renderizarResponsavelRodape(ausente)).toBe("Acme LTDA");
    // a mesma responsavel, na jurídica, continua mostrando — prova que a
    // ausência no rodapé é a regra do campo, não uma função quebrada.
    expect(renderizarResponsavelJuridico(ausente)).toBe("Acme LTDA — CNPJ 12.345.678/0001-90");
  });

  it("caso 3 — PF com documento preenchido: nenhum dos dois caminhos mostra, nem com o campo ligado", () => {
    const pf = { nome: "Fulano", tipo: "pf" as const, documento: "123.456.789-00", mostrarDocumentoNoRodape: true };
    const rodape = renderizarResponsavelRodape(pf);
    const juridico = renderizarResponsavelJuridico(pf);

    expect(rodape).toBe("Fulano");
    expect(juridico).toBe("Fulano");
    expect(rodape).not.toContain("123.456.789-00");
    expect(juridico).not.toContain("123.456.789-00");
  });

  it("caso 4 — PF sem documento: nome apenas, sem sobra de separador", () => {
    expect(renderizarResponsavelRodape({ nome: "Fulano", tipo: "pf" })).toBe("Fulano");
  });
});
