import { describe, expect, it, vi } from "vitest";
import { manejarContato, type PortasDeContato } from "./contato";

const formulario = (campos: Record<string, string>): Request =>
  new Request("https://exemplo.com.br/api/contato", {
    method: "POST",
    body: new URLSearchParams(campos),
  });

const validos = {
  nome: "Fulano", email: "fulano@teste.com", mensagem: "Oi", site: "exemplo", token: "t",
};

const portas = (over: Partial<PortasDeContato> = {}): PortasDeContato => ({
  verificar: vi.fn().mockResolvedValue(true),
  enviar: vi.fn().mockResolvedValue(true),
  destino: "dono@exemplo.com.br",
  ...over,
});

describe("manejarContato", () => {
  it("recusa metodo que nao e POST", async () => {
    const r = await manejarContato(new Request("https://exemplo.com.br/api/contato"), portas());
    expect(r.status).toBe(405);
  });

  it("recusa quando falta campo obrigatorio", async () => {
    const r = await manejarContato(formulario({ ...validos, mensagem: "" }), portas());
    expect(r.status).toBe(400);
  });

  it("recusa e-mail malformado", async () => {
    const r = await manejarContato(formulario({ ...validos, email: "nao-e-email" }), portas());
    expect(r.status).toBe(400);
  });

  it("recusa quando a verificacao humana falha, e nao envia nada", async () => {
    const p = portas({ verificar: vi.fn().mockResolvedValue(false) });
    const r = await manejarContato(formulario(validos), p);
    expect(r.status).toBe(403);
    expect(p.enviar).not.toHaveBeenCalled();
  });

  it("responde 503 e nao envia quando a porta de e-mail esta inerte", async () => {
    const p = portas({ destino: null });
    const r = await manejarContato(formulario(validos), p);
    expect(r.status).toBe(503);
    expect(p.enviar).not.toHaveBeenCalled();
  });

  it("envia para o destino e redireciona no sucesso", async () => {
    const p = portas();
    const r = await manejarContato(formulario(validos), p);
    expect(r.status).toBe(302);
    expect(r.headers.get("location")).toBe("/contato-recebido/");
    expect(p.enviar).toHaveBeenCalledWith(
      expect.objectContaining({
        para: "dono@exemplo.com.br",
        responderPara: "fulano@teste.com",
      }),
    );
  });

  it("poe o nome de quem escreveu no assunto", async () => {
    const p = portas();
    await manejarContato(formulario(validos), p);
    expect(vi.mocked(p.enviar).mock.calls[0][0].assunto).toContain("Fulano");
  });

  it("devolve 502 quando o envio falha", async () => {
    const p = portas({ enviar: vi.fn().mockResolvedValue(false) });
    const r = await manejarContato(formulario(validos), p);
    expect(r.status).toBe(502);
  });
});
