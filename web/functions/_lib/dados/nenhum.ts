/**
 * O adaptador padrão desta porta. Sempre falha em `guardar` e devolve lista
 * vazia em `listar` — coerente com a porta estar endereçada e INERTE: sem
 * `d1` escrito ainda, não há onde persistir de verdade.
 */
import type { Deposito, Pendente } from "./porta";

export const nenhum: Deposito = {
  async guardar(_colecao: string, _p: Pendente): Promise<boolean> {
    return false;
  },
  async listar(_colecao: string): Promise<Pendente[]> {
    return [];
  },
};
