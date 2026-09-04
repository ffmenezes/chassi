import { describe, expect, it, vi } from "vitest";
import { escolherVerificador } from "./porta";

describe("escolherVerificador", () => {
  it("sem segredo, fica inerte e deixa passar", async () => {
    const { adaptador, verificar } = escolherVerificador({});
    expect(adaptador).toBe("nenhum");
    expect(await verificar("", null)).toBe(true);
  });

  it("com segredo, usa turnstile", () => {
    expect(escolherVerificador({ TURNSTILE_SECRET: "s" }).adaptador).toBe("turnstile");
  });

  it("turnstile: token vazio e recusado sem chamar a rede", async () => {
    const fetchFalso = vi.fn();
    const { verificar } = escolherVerificador({ TURNSTILE_SECRET: "s" }, fetchFalso);
    expect(await verificar("", null)).toBe(false);
    expect(fetchFalso).not.toHaveBeenCalled();
  });

  it("turnstile: true quando a api diz success", async () => {
    const fetchFalso = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true })),
    );
    const { verificar } = escolherVerificador({ TURNSTILE_SECRET: "s" }, fetchFalso);
    expect(await verificar("tok", "1.2.3.4")).toBe(true);
  });

  it("turnstile: falha FECHADA quando a rede cai", async () => {
    const fetchFalso = vi.fn().mockRejectedValue(new Error("rede"));
    const { verificar } = escolherVerificador({ TURNSTILE_SECRET: "s" }, fetchFalso);
    expect(await verificar("tok", null)).toBe(false);
  });
});
