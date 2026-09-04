/**
 * A porta de dados existe endereçada e INERTE.
 *
 * O desenho da casa usa o banco como caixa de entrada de pendentes: comentário
 * publicado vive em `comentarios.json` no git, não no banco — o banco serve a
 * moderação, o repo serve o leitor. São poucos registros por semana, sem
 * leitura em produção.
 *
 * Por isso D1 ganha de Supabase quando a hora chegar: mesmo fornecedor do
 * deploy, do DNS e do e-mail, um comando para criar, zero conta nova. Supabase
 * traria um segundo fornecedor guardando E-MAIL DE LEITOR — superfície de LGPD
 * nova, num projeto que redige política de privacidade — para uma tabela que o
 * site nunca lê.
 *
 * O adaptador `d1` chega na aula em que comentário for o assunto, como ARQUIVO
 * NOVO, que é o formato que `scripts/atualizar` entrega sem conflito.
 */
import { nenhum } from "./nenhum";

export interface Pendente {
  id: string;
  criadoEm: string;
  carga: Record<string, unknown>;
}

export interface Deposito {
  guardar(colecao: string, p: Pendente): Promise<boolean>;
  listar(colecao: string): Promise<Pendente[]>;
}

export interface EscolhaDeDados {
  deposito: Deposito;
  adaptador: "d1" | "nenhum";
}

export function escolherDeposito(env: { DB?: unknown }): EscolhaDeDados {
  // O adaptador `d1` ainda não existe — `env.DB` não muda a escolha por ora.
  void env.DB;
  return { deposito: nenhum, adaptador: "nenhum" };
}
