import { describe, it, expect } from "vitest";
import { otimizar } from "./imagens";

describe("otimizar", () => {
  it("resolve o caminho do acervo e devolve srcset", async () => {
    const f = await otimizar("exemplo/medicao.png");
    expect(f.largura).toBe(960);
    expect(f.altura).toBe(540);
    expect(f.srcset.length).toBeGreaterThan(0);
    expect(f.sizes.length).toBeGreaterThan(0);
  });

  it("src fora do acervo quebra, com o caminho na mensagem", async () => {
    await expect(otimizar("nao/existe.png")).rejects.toThrow(/nao\/existe\.png/);
  });

  it("a mensagem diz onde o acervo mora, porque o erro tem de dar o proximo passo", async () => {
    await expect(otimizar("nao/existe.png")).rejects.toThrow(/src\/imagens/);
  });

  it("largura declarada divergente do arquivo quebra", async () => {
    await expect(otimizar("exemplo/medicao.png", 1024)).rejects.toThrow(/largura/i);
  });

  it("altura declarada divergente do arquivo quebra", async () => {
    await expect(otimizar("exemplo/medicao.png", 960, 480)).rejects.toThrow(/altura/i);
  });

  it("largura e altura corretas passam", async () => {
    const f = await otimizar("exemplo/medicao.png", 960, 540);
    expect(f.largura).toBe(960);
  });
});
