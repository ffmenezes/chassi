/** Adaptador Pages Functions. Monta as portas a partir do env e delega. */
import { manejarContato } from "../_lib/contato";
import { portasDeContato, type Env } from "../_lib/ambiente";

export const onRequestPost: PagesFunction<Env> = ({ request, env }) =>
  manejarContato(request, portasDeContato(env, request));
