import { describe, it, expect } from "vitest";
import { pendenciaDoAutor, autorAssina } from "./autor";
import type { Autor } from "./autor";

/** Um autor completo, para cada teste estragar um campo de cada vez. */
const cheio = (): Autor => ({
  nome: "Fulano de Tal",
  slug: "fulano-de-tal",
  jobTitle: "Profissional-exemplo, 12 anos de experiência de mentirinha",
  description: "Preencheu esta biografia só para o teste passar, sem ligação com nicho nenhum. Não existe pessoa real por trás deste nome de exemplo.",
  image: "/autores/fulano-de-tal.jpg",
  sameAs: [],
});

describe("pendenciaDoAutor", () => {
  it("aceita o autor completo, e sameAs vazio é resposta, não pendência", () => {
    expect(pendenciaDoAutor(cheio())).toBeNull();
  });

  it("não nasce sem autor nenhum", () => {
    expect(pendenciaDoAutor(undefined)).toMatch(/AUTOR\.md/);
  });

  it.each(["nome", "slug", "jobTitle", "description", "image"] as const)(
    "não nasce com %s vazio",
    (campo) => {
      const a = { ...cheio(), [campo]: "" };
      expect(pendenciaDoAutor(a)).toContain(campo);
    },
  );

  it.each(["nome", "slug", "jobTitle", "description", "image"] as const)(
    "não nasce com o placeholder do AUTOR.md ainda em %s",
    (campo) => {
      const a = { ...cheio(), [campo]: "[DEFINIR: nome e sobrenome reais]" };
      expect(pendenciaDoAutor(a)).toContain(campo);
    },
  );

  it("não aceita primeiro nome solto: byline é pessoa inteira", () => {
    expect(pendenciaDoAutor({ ...cheio(), nome: "Fulano" })).toMatch(/sobrenome/i);
  });

  it.each(["Equipe", "Redação", "Redacao", "Equipe Editorial", "A REDAÇÃO"])(
    "não aceita coletivo assinando: %s",
    (nome) => {
      expect(pendenciaDoAutor({ ...cheio(), nome })).toMatch(/pessoa real/i);
    },
  );

  it("não nasce com sameAs ausente: lista vazia é uma resposta, ausência é pendência", () => {
    const { sameAs: _, ...sem } = cheio();
    expect(pendenciaDoAutor(sem as Autor)).toContain("sameAs");
  });

  it("nasce sem perfil: a página /autores/{slug} ainda não existe em site nenhum", () => {
    const { perfil: _, ...sem } = { ...cheio(), perfil: undefined };
    expect(pendenciaDoAutor(sem as Autor)).toBeNull();
  });
});

describe("autorAssina", () => {
  it("é o mesmo julgamento, na forma que o componente usa", () => {
    expect(autorAssina(cheio())).toBe(true);
    expect(autorAssina(undefined)).toBe(false);
    expect(autorAssina({ ...cheio(), image: "" })).toBe(false);
  });
});
