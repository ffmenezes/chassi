/**
 * Adaptador Worker. INERTE — não está no wrangler.toml.
 *
 * Existe porque a Cloudflare empurra Pages -> Workers com static assets, e
 * quando essa migração vier ela deve ser trocar de adaptador, não reescrever
 * handler.
 */
import { manejarContato } from "../functions/_lib/contato";
import { portasDeContato, type Env } from "../functions/_lib/ambiente";

export default {
  fetch: (request: Request, env: Env) => manejarContato(request, portasDeContato(env, request)),
};
