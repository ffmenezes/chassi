import { describe, expect, it } from "vitest";
import { foiFechada } from "./avisoBarra";

describe("foiFechada", () => {
  it("nunca fechou: nada gravado", () => {
    expect(foiFechada(null, "Fechado no feriado de 7 de setembro")).toBe(false);
  });

  it("fechou o mesmo texto: continua fechada", () => {
    const registro = { texto: "Fechado no feriado de 7 de setembro", data: "2026-09-01" };
    expect(foiFechada(registro, "Fechado no feriado de 7 de setembro")).toBe(true);
  });

  it("o texto mudou desde o fechamento: volta a aparecer", () => {
    // Esta é a régua toda: se comparasse só "existe registro?", um aviso de
    // setembro fechado continuaria escondendo um aviso completamente
    // diferente em outubro. Sem este teste, `foiFechada` poderia degenerar
    // para `armazenado !== null` e passar despercebido — ver o teste abaixo.
    const registro = { texto: "Fechado no feriado de 7 de setembro", data: "2026-09-01" };
    expect(foiFechada(registro, "Promoção de outubro")).toBe(false);
  });
});
