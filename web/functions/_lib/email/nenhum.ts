/**
 * O adaptador padrão de toda porta.
 *
 * Existir é o que garante que o chassi builda e publica sem conta nenhuma
 * configurada — e, mais importante, que este caminho é EXERCITADO no build de
 * todo mundo em vez de ser código morto que ninguém rodou.
 */
import type { MensagemDeContato } from "../contato";

export const enviarPorNenhum = async (_msg: MensagemDeContato): Promise<boolean> => false;
