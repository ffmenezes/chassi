import { describe, expect, it } from "vitest";
import {
  conferirVideo,
  idDoYoutube,
  proporcaoDe,
  proximaMarca,
  urlDeAssistir,
  urlDoEmbed,
} from "./video";
import type { DadosVideo } from "./video";

/* Fábrica curta, como em `grafico.test.ts`: um vídeo válido, e cada teste
   muda só o que exercita. */
const arquivo = (over: Partial<DadosVideo> = {}): DadosVideo => ({
  titulo: "O monitor registrando o pico das 6h18, em tempo real",
  legenda:
    "O gráfico passa dos 300 Mbps no segundo em que o backup entra. É o mesmo pico da tabela, visto acontecendo.",
  duracao: "1 min 40 s",
  origem: { tipo: "arquivo", src: "/exemplo/medicao.mp4", largura: 640, altura: 360 },
  ...over,
});

const youtube = (over: Partial<DadosVideo> = {}): DadosVideo => ({
  ...arquivo(),
  origem: { tipo: "youtube", id: "aqz-KE-bpKQ" },
  ...over,
});

describe("conferirVideo — o que todo vídeo precisa ter", () => {
  it("aceita as duas origens completas", () => {
    expect(() => conferirVideo(arquivo())).not.toThrow();
    expect(() => conferirVideo(youtube())).not.toThrow();
  });

  it("recusa sem título, que é o nome acessível do player", () => {
    expect(() => conferirVideo(arquivo({ titulo: "  " }))).toThrow(/sem título/);
  });

  it("recusa sem legenda, porque a legenda é a única parte que todo mundo recebe", () => {
    expect(() => conferirVideo(arquivo({ legenda: "" }))).toThrow(/sem legenda/);
  });

  it("recusa legenda igual ao título, o mesmo defeito do alt igual à legenda no bloco 19", () => {
    const t = "O monitor registrando o pico das 6h18";
    expect(() => conferirVideo(arquivo({ titulo: t, legenda: t }))).toThrow(/mesmo texto/);
    /* e o espaço em volta não escapa da trava: o defeito é o texto, não o
       byte. Sem o `.trim()` dos dois lados esta linha passaria. */
    expect(() => conferirVideo(arquivo({ titulo: t, legenda: `  ${t} ` }))).toThrow(/mesmo texto/);
  });

  it("recusa sem duração, que é o que o leitor usa para decidir antes do play", () => {
    expect(() => conferirVideo(arquivo({ duracao: " " }))).toThrow(/sem duração/);
  });
});

describe("conferirVideo — a origem `arquivo`", () => {
  it("recusa src vazio", () => {
    expect(() =>
      conferirVideo(arquivo({ origem: { tipo: "arquivo", src: "  " } })),
    ).toThrow(/sem `src`/);
  });

  it("recusa endereço de YouTube em `src` e aponta a variante certa", () => {
    expect(() =>
      conferirVideo(
        arquivo({ origem: { tipo: "arquivo", src: "https://youtu.be/aqz-KE-bpKQ" } }),
      ),
    ).toThrow(/tipo: "youtube"/);
    expect(() =>
      conferirVideo(
        arquivo({
          origem: { tipo: "arquivo", src: "https://www.youtube.com/watch?v=aqz-KE-bpKQ" },
        }),
      ),
    ).toThrow(/tipo: "youtube"/);
  });

  it("recusa URL que não é arquivo de vídeo, porque página vira player mudo", () => {
    expect(() =>
      conferirVideo(arquivo({ origem: { tipo: "arquivo", src: "/exemplo/medicao" } })),
    ).toThrow(/extensão de vídeo/);
    expect(() =>
      conferirVideo(
        arquivo({ origem: { tipo: "arquivo", src: "https://cdn.exemplo.com/pagina.html" } }),
      ),
    ).toThrow(/extensão de vídeo/);
  });

  it("aceita as extensões que um <video> toca, inclusive com query", () => {
    for (const src of [
      "/a.mp4",
      "/a.webm",
      "/a.ogv",
      "/a.mov",
      "https://cdn.exemplo.com/a.mp4?v=3",
    ]) {
      expect(() => conferirVideo(arquivo({ origem: { tipo: "arquivo", src } }))).not.toThrow();
    }
  });

  it("recusa largura sem altura, porque uma sozinha não dá proporção", () => {
    expect(() =>
      conferirVideo(arquivo({ origem: { tipo: "arquivo", src: "/a.mp4", largura: 640 } })),
    ).toThrow(/em par/);
    expect(() =>
      conferirVideo(arquivo({ origem: { tipo: "arquivo", src: "/a.mp4", altura: 360 } })),
    ).toThrow(/em par/);
    /* nenhuma das duas é legítimo: cai no 16/9 */
    expect(() =>
      conferirVideo(arquivo({ origem: { tipo: "arquivo", src: "/a.mp4" } })),
    ).not.toThrow();
  });

  it("recusa dimensão que não é número positivo", () => {
    expect(() =>
      conferirVideo(
        arquivo({ origem: { tipo: "arquivo", src: "/a.mp4", largura: 0, altura: 360 } }),
      ),
    ).toThrow(/números positivos/);
    expect(() =>
      conferirVideo(
        arquivo({ origem: { tipo: "arquivo", src: "/a.mp4", largura: 640, altura: NaN } }),
      ),
    ).toThrow(/números positivos/);
  });
});

describe("idDoYoutube — o autor cola o que tem", () => {
  const ID = "aqz-KE-bpKQ";

  it("aceita o id cru", () => {
    expect(idDoYoutube(ID)).toBe(ID);
    expect(idDoYoutube(`  ${ID}  `)).toBe(ID);
  });

  it("aceita as quatro formas de URL em que o id costuma chegar", () => {
    expect(idDoYoutube(`https://youtu.be/${ID}`)).toBe(ID);
    expect(idDoYoutube(`https://www.youtube.com/watch?v=${ID}`)).toBe(ID);
    expect(idDoYoutube(`https://www.youtube.com/embed/${ID}`)).toBe(ID);
    expect(idDoYoutube(`https://www.youtube.com/shorts/${ID}`)).toBe(ID);
    expect(idDoYoutube(`https://www.youtube-nocookie.com/embed/${ID}`)).toBe(ID);
  });

  it("ignora o resto da query e o tempo colado no link", () => {
    expect(idDoYoutube(`https://www.youtube.com/watch?v=${ID}&t=42s&list=PL123`)).toBe(ID);
    expect(idDoYoutube(`https://youtu.be/${ID}?t=42`)).toBe(ID);
  });

  it("recusa link que não aponta para um vídeo", () => {
    expect(() => idDoYoutube("https://www.youtube.com/@algumcanal")).toThrow(/não aponta/);
    expect(() => idDoYoutube("https://www.youtube.com/playlist?list=PL123")).toThrow(/não aponta/);
    expect(() => idDoYoutube("https://www.youtube.com/results?search_query=x")).toThrow(
      /não aponta/,
    );
  });

  /* Este caso existe porque a suíte não pegou uma quebra de propósito. Trocar
     a lista de prefixos (`embed`/`shorts`/`live`) por "pega o segundo segmento,
     e no pior caso o primeiro" continuou verde: os links de canal e de
     playlist acima têm segmento com tamanho errado e caem no teste de 11
     caracteres por acidente, não pela regra. Um segmento de canal com 11
     caracteres passaria — e o iframe nasceria apontando para um canal.
     É o erro 11 da skill, ao vivo: teste verde contra implementação quebrada. */
  it("recusa segmento de 11 caracteres que não está depois de embed, shorts ou live", () => {
    expect(() => idDoYoutube("https://www.youtube.com/channel/UC12345678a")).toThrow(/não aponta/);
    expect(() => idDoYoutube("https://www.youtube.com/c/aqzKEbpKQxy")).toThrow(/não aponta/);
  });

  it("recusa id de tamanho errado, que é o erro de digitação que renderiza cinza", () => {
    expect(() => idDoYoutube("aqz-KE-bpK")).toThrow(/não é id nem URL|não aponta/);
    expect(() => idDoYoutube(`https://youtu.be/aqz-KE-bpK`)).toThrow(/não aponta/);
  });

  it("recusa vazio e recusa domínio de outro serviço", () => {
    expect(() => idDoYoutube("   ")).toThrow(/sem id/);
    expect(() => idDoYoutube("https://vimeo.com/123456789")).toThrow(/não aponta/);
  });
});

describe("urlDoEmbed — a URL da fachada", () => {
  const ID = "aqz-KE-bpKQ";

  it("usa o domínio sem cookie, e não o youtube.com de sempre", () => {
    expect(urlDoEmbed(ID)).toContain("https://www.youtube-nocookie.com/embed/" + ID);
    expect(urlDoEmbed(ID)).not.toContain("//www.youtube.com/");
  });

  it("leva os cinco parâmetros que ainda têm efeito", () => {
    const u = new URL(urlDoEmbed(ID));
    expect(u.searchParams.get("autoplay")).toBe("1");
    expect(u.searchParams.get("rel")).toBe("0");
    expect(u.searchParams.get("playsinline")).toBe("1");
    expect(u.searchParams.get("enablejsapi")).toBe("1");
    expect(u.searchParams.get("color")).toBe("white");
  });

  it("não leva os parâmetros descontinuados, que seriam ruído acreditável", () => {
    const u = new URL(urlDoEmbed(ID));
    expect(u.searchParams.has("modestbranding")).toBe(false);
    expect(u.searchParams.has("iv_load_policy")).toBe(false);
  });

  it("só manda `origin` quando a página sabe qual é a dela", () => {
    expect(new URL(urlDoEmbed(ID)).searchParams.has("origin")).toBe(false);
    expect(new URL(urlDoEmbed(ID, "https://exemplo.com.br")).searchParams.get("origin")).toBe(
      "https://exemplo.com.br",
    );
  });

  it("o link de quem não tem JavaScript é o watch de sempre", () => {
    expect(urlDeAssistir(ID)).toBe(`https://www.youtube.com/watch?v=${ID}`);
  });
});

describe("proximaMarca — id único por instância", () => {
  /* A versão anterior deste contador morava no frontmatter do `.astro`, que
     roda inteiro a cada instância: ele voltava a zero toda vez, e os dois
     vídeos de uma mesma página saíam com o mesmo `id`. O defeito só apareceu
     medindo no navegador. Aqui ele fica preso: se alguém devolver o contador
     para dentro do componente, esta expectativa cai. */
  it("nunca repete, mesmo em chamadas seguidas", () => {
    const marcas = Array.from({ length: 50 }, () => proximaMarca());
    expect(new Set(marcas).size).toBe(50);
  });
  it("é um identificador válido para `id` de HTML", () => {
    expect(proximaMarca()).toMatch(/^v\d+$/);
  });
});

describe("proporcaoDe — o quadro sai do conteúdo, não do estilo", () => {
  it("usa as dimensões do arquivo quando elas existem", () => {
    expect(proporcaoDe({ tipo: "arquivo", src: "/a.mp4", largura: 1080, altura: 1920 })).toBe(
      "1080 / 1920",
    );
  });
  it("cai em 16/9 sem dimensões e no YouTube, que só tem essa", () => {
    expect(proporcaoDe({ tipo: "arquivo", src: "/a.mp4" })).toBe("16 / 9");
    expect(proporcaoDe({ tipo: "youtube", id: "aqz-KE-bpKQ" })).toBe("16 / 9");
  });
});
