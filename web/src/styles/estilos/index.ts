/**
 * Varre a pasta em vez de listar à mão.
 *
 * O import do módulo traz o CSS junto (cada `<nome>.ts` importa o seu
 * `<nome>.css`), então este arquivo é a única coisa que o layout precisa
 * importar para ter forma, cor e metadados dos estilos.
 */
export interface MetaEstilo {
  nome: string;
  acento: string;
  /** De onde vieram os tokens. Serve ao inventário e à honestidade. */
  origem: string;
  /**
   * URLs das fontes auto-hospedadas que a PRIMEIRA pintura precisa (importe
   * com `?url`). O `Base.astro` faz `preload` delas no `<head>`: sem isso, o
   * pedido da fonte só sai depois que o CSS chega e é lido, e o texto aparece
   * numa fonte e troca para outra na frente do leitor. Só o recorte que toda
   * página usa; recorte raro fica para o `unicode-range` baixar sob demanda.
   */
  fontes?: string[];
}

const modulos = import.meta.glob("./*.ts", {
  eager: true,
  import: "default",
}) as Record<string, MetaEstilo>;

export const ESTILOS: Record<string, MetaEstilo> = Object.fromEntries(
  Object.entries(modulos)
    .filter(([caminho]) => !caminho.endsWith("/index.ts"))
    .map(([caminho, meta]) => [caminho.replace("./", "").replace(".ts", ""), meta]),
);

export const nomesDeEstilo = (): string[] => Object.keys(ESTILOS).sort();
