import { describe, it, expect } from "vitest";
import { urlDaAncora } from "./copiarLink";

const PAGINA = "https://exemplo.com.br/quanto-custa/";

describe("urlDaAncora", () => {
  it("gruda a âncora da seção na URL absoluta da página", () => {
    expect(urlDaAncora("#s2", PAGINA)).toBe(`${PAGINA}#s2`);
  });

  it("sem âncora, entrega a página limpa — é o botão do título", () => {
    expect(urlDaAncora("", PAGINA)).toBe(PAGINA);
  });

  /* O leitor rola, o navegador troca o fragmento sozinho, e aí ele clica no elo
     de OUTRA seção. Herdar o fragmento de onde ele está copiaria a seção errada. */
  it("troca o fragmento que já estava na barra, não acumula", () => {
    expect(urlDaAncora("#s4", `${PAGINA}#s1`)).toBe(`${PAGINA}#s4`);
    expect(urlDaAncora("", `${PAGINA}#s1`)).toBe(PAGINA);
  });

  it("preserva o que é da página — caminho e query ficam", () => {
    expect(urlDaAncora("#s2", `${PAGINA}?pagina=2`)).toBe(`${PAGINA}?pagina=2#s2`);
  });

  it("codifica o id com acento, porque é assim que ele viaja colado num chat", () => {
    expect(urlDaAncora("#instalação", PAGINA)).toBe(`${PAGINA}#instala%C3%A7%C3%A3o`);
  });

  it("aceita o id cru, sem a cerquilha", () => {
    expect(urlDaAncora("s2", PAGINA)).toBe(`${PAGINA}#s2`);
  });
});
