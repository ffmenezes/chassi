/**
 * O elo que o leitor copia — do título e de cada seção.
 *
 * A parte que decide QUAL URL sai daqui, pura e testada. O que toca área de
 * transferência e DOM fica no <script> do componente, porque não se testa em
 * Node sem simular metade do navegador.
 */

/**
 * A URL absoluta que vai para a área de transferência.
 *
 * `base` é `location.href`, e o fragmento dele é DESCARTADO: o navegador troca
 * o `#` sozinho conforme o leitor rola, então herdá-lo copiaria a seção onde o
 * leitor está em vez da seção cujo elo ele clicou.
 *
 * Sem âncora, sai a página limpa — é o botão do cabeçalho.
 */
export function urlDaAncora(href: string, base: string): string {
  const u = new URL(base);
  const id = href.startsWith("#") ? href.slice(1) : href;
  /* limpa primeiro: sem isto, `#s1` na barra sobreviveria ao botão do título */
  u.hash = "";
  if (id) u.hash = id;
  return u.toString();
}

/** Quanto tempo o rótulo fica em "Copiado" antes de voltar ao que era. */
const ESPERA = 1600;

let ligado = false;

/**
 * Liga a cópia na página. Idempotente de propósito: o cabeçalho e cada heading
 * chamam esta função, e todos compartilham um ouvinte só, delegado no document
 * — o que também faz funcionar heading que apareça depois do load.
 *
 * Melhoria progressiva, e a linha é esta: sem `navigator.clipboard` a função
 * NÃO chama `preventDefault`, então o `<a>` do heading volta a ser um `<a>` e
 * navega até a seção. O botão do cabeçalho, esse, não faz nada — é o preço de
 * uma ação que não existe sem a API.
 */
export function ligarCopia(): void {
  if (ligado) return;
  ligado = true;

  /* Um aviso só para a página inteira. Criado aqui, e não no markup, porque
     senão cada heading traria o seu e o leitor de tela ouviria a fila toda. */
  const aviso = document.createElement("p");
  aviso.className = "b-sr";
  aviso.setAttribute("role", "status");
  aviso.setAttribute("aria-live", "polite");
  document.body.append(aviso);

  const relogios = new WeakMap<HTMLElement, number>();

  const marcar = (alvo: HTMLElement) => {
    const rotulo = alvo.querySelector<HTMLElement>("[data-copia-rotulo]");
    const depois = alvo.dataset.copiaDepois ?? "Copiado";
    alvo.dataset.copiado = "";
    if (rotulo) rotulo.textContent = depois;
    aviso.textContent = "Link copiado.";

    clearTimeout(relogios.get(alvo));
    relogios.set(
      alvo,
      window.setTimeout(() => {
        delete alvo.dataset.copiado;
        if (rotulo) rotulo.textContent = alvo.dataset.copiaAntes ?? "Copiar link";
        aviso.textContent = "";
      }, ESPERA),
    );
  };

  document.addEventListener("click", (ev) => {
    const alvo = (ev.target as Element | null)?.closest<HTMLElement>("[data-copia]");
    if (!alvo) return;
    if (!navigator.clipboard) return;

    ev.preventDefault();
    /* o botão do cabeçalho não tem href, e sem fragmento sai a página limpa */
    const href = alvo.getAttribute("href") ?? "";
    navigator.clipboard.writeText(urlDaAncora(href, location.href)).then(
      () => marcar(alvo),
      () => {
        /* Negado — política de empresa, Firefox travado, origem sem HTTPS. Não
           se mente que copiou; mas o `preventDefault` já saiu, e sem isto o elo
           do heading não copiaria NEM navegaria: o clique morreria calado, que
           é pior que não ter o botão. Devolve o comportamento de <a>. */
        if (href) location.hash = href;
      },
    );
  });
}
