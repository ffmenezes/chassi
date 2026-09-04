/**
 * A lógica do formulário de contato, sem runtime nenhum.
 *
 * Recebe as portas por parâmetro em vez de ler `env`: é isso que permite
 * testar sem Pages, sem Workers e sem rede. Os adaptadores finos
 * (`functions/api/contato.ts` e `worker/contato.ts`) montam as portas a partir
 * do ambiente e chamam esta função.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LIMITE_MENSAGEM = 5000;

export interface MensagemDeContato {
  para: string;
  assunto: string;
  corpo: string;
  /** Reply-To. O remetente é sempre o domínio do site, nunca o do leitor —
   *  e-mail que diz vir de um domínio alheio vai direto para spam. */
  responderPara: string;
}

export interface PortasDeContato {
  verificar(token: string, ip: string | null): Promise<boolean>;
  enviar(msg: MensagemDeContato): Promise<boolean>;
  /** Para onde a mensagem vai. `null` = porta de e-mail inerte. */
  destino: string | null;
}

const texto = (corpo: string, status: number): Response =>
  new Response(corpo, { status, headers: { "content-type": "text/plain; charset=utf-8" } });

export async function manejarContato(
  request: Request,
  portas: PortasDeContato,
): Promise<Response> {
  if (request.method !== "POST") return texto("Método não permitido.", 405);

  const form = await request.formData();
  const nome = String(form.get("nome") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const mensagem = String(form.get("mensagem") ?? "").trim();
  const token = String(form.get("token") ?? form.get("cf-turnstile-response") ?? "");

  if (!nome || !email || !mensagem) return texto("Preencha nome, e-mail e mensagem.", 400);
  if (!EMAIL.test(email)) return texto("E-mail inválido.", 400);
  if (mensagem.length > LIMITE_MENSAGEM) return texto("Mensagem longa demais.", 400);

  const ip = request.headers.get("CF-Connecting-IP");
  /* Falha fechada: verificação fora do ar recusa, não deixa passar. Anti-spam
     que abre quando quebra não é anti-spam. */
  if (!(await portas.verificar(token, ip))) return texto("Verificação falhou.", 403);

  if (!portas.destino) return texto("Formulário não configurado neste site.", 503);

  const enviou = await portas.enviar({
    para: portas.destino,
    responderPara: email,
    assunto: "Contato pelo site — " + nome,
    corpo: "De: " + nome + " <" + email + ">\n\n" + mensagem + "\n",
  });
  if (!enviou) return texto("Não foi possível enviar agora. Tente de novo em instantes.", 502);

  return new Response(null, { status: 302, headers: { location: "/contato-recebido/" } });
}
