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
