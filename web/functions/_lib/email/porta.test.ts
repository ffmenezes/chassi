import { describe, expect, it, vi } from "vitest";
import { escolherEnviador } from "./porta";

const msg = {
  para: "dono@teste.com", assunto: "Oi", corpo: "corpo", responderPara: "leitor@teste.com",
};

describe("escolherEnviador", () => {
  it("sem nada configurado, fica inerte: destino null e envio falso", async () => {
    const { destino, adaptador, enviar } = escolherEnviador({});
    expect(adaptador).toBe("nenhum");
    expect(destino).toBeNull();
    expect(await enviar(msg)).toBe(false);
  });

  it("com EMAIL_CONTATO mas sem enviador, continua inerte", () => {
    expect(escolherEnviador({ EMAIL_CONTATO: "dono@teste.com" }).adaptador).toBe("nenhum");
  });

  it("prefere resend quando a chave existe", () => {
    const r = escolherEnviador({ RESEND_API_KEY: "re_x", EMAIL_CONTATO: "dono@teste.com" });
    expect(r.adaptador).toBe("resend");
    expect(r.destino).toBe("dono@teste.com");
  });

  it("cai para cloudflare quando so ha binding", () => {
    const r = escolherEnviador({ EMAIL_BINDING: { send: vi.fn() }, EMAIL_CONTATO: "d@t.com" });
    expect(r.adaptador).toBe("cloudflare");
  });

  it("resend: POST na api, com reply_to, e true em 200", async () => {
    const fetchFalso = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    const { enviar } = escolherEnviador(
      { RESEND_API_KEY: "re_x", EMAIL_CONTATO: "dono@teste.com" }, fetchFalso,
    );
    expect(await enviar(msg)).toBe(true);
    const [url, init] = fetchFalso.mock.calls[0];
    expect(String(url)).toContain("api.resend.com");
    expect(JSON.parse(String(init.body)).reply_to).toBe("leitor@teste.com");
  });

  it("resend: false quando a api recusa", async () => {
    const fetchFalso = vi.fn().mockResolvedValue(new Response("erro", { status: 422 }));
    const { enviar } = escolherEnviador(
      { RESEND_API_KEY: "re_x", EMAIL_CONTATO: "dono@teste.com" }, fetchFalso,
    );
    expect(await enviar(msg)).toBe(false);
  });

  it("resend: false quando a rede cai, sem estourar excecao", async () => {
    const fetchFalso = vi.fn().mockRejectedValue(new Error("rede"));
    const { enviar } = escolherEnviador(
      { RESEND_API_KEY: "re_x", EMAIL_CONTATO: "dono@teste.com" }, fetchFalso,
    );
    expect(await enviar(msg)).toBe(false);
  });
});
