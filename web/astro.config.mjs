import { defineConfig } from "astro/config";

export default defineConfig({
  // Geração estática, com o corpo do artigo no HTML inicial.
  // Não é preferência: é o que referencias/infra.md exige, porque crawler
  // de IA não executa JavaScript e o que só aparece depois do JS não existe.
  output: "static",
  build: { format: "directory" },
  devToolbar: { enabled: false },

  // PT-BR sem prefixo: `/sobre` continua `/sobre`. A porta do multi-idioma
  // fica aberta (`/en/sobre` nasce depois) sem custo e sem prefixo hoje —
  // ver web/src/idioma.ts.
  i18n: {
    defaultLocale: "pt-br",
    locales: ["pt-br"],
    routing: { prefixDefaultLocale: false },
  },

  // `host: true` escuta em 0.0.0.0, que é o que um túnel precisa alcançar.
  server: { host: true, port: 4321 },

  vite: {
    server: {
      // O Vite recusa Host desconhecido por padrão, e o túnel chega com um
      // subdomínio aleatório. Sem isto o cloudflared devolve "Blocked request".
      allowedHosts: [".trycloudflare.com", ".cfargotunnel.com"],
      // O HMR sai por wss na porta 443 do túnel, não na porta local.
      hmr: { clientPort: 443, protocol: "wss" },
    },
  },
});
