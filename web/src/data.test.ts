import { describe, it, expect } from "vitest";
import { dataBR } from "./data";

describe("dataBR", () => {
  it("vira o dia de calendário no formato que o leitor brasileiro lê", () => {
    expect(dataBR("2026-08-12")).toBe("12/08/2026");
  });

  it("não desloca por fuso: 1º do mês não vira o último do mês anterior", () => {
    // `new Date("2026-08-01")` é meia-noite UTC, e em UTC-3 isso é 31/07.
    expect(dataBR("2026-08-01")).toBe("01/08/2026");
  });

  it("recusa o que não é dia de calendário, em vez de inventar", () => {
    expect(() => dataBR("12/08/2026")).toThrow(/YYYY-MM-DD/);
    expect(() => dataBR("2026-08-12T10:00:00Z")).toThrow(/YYYY-MM-DD/);
  });
});
