// Primeiro vitest.config.ts do repositório. Existe só porque src/imagens.ts
// importa de "astro:assets" — um módulo virtual que só existe dentro do
// plugin Vite do próprio Astro. Sem carregar a configuração do Astro aqui,
// o Vitest não sabe resolver esse import e a suíte de imagens.test.ts falha
// antes mesmo de rodar um teste ("Cannot find package 'astro:assets'").
import { getViteConfig } from "astro/config";

// @ts-expect-error — `astro` (vite 8) e `vitest` (vite 7, embutido) trazem
// tipos de UserConfig de pacotes "vite" diferentes; o augment de `test` que
// o vitest declara não bate com o UserConfig que getViteConfig espera. Isso
// é descompasso de versão entre as duas dependências, não erro de config —
// em tempo de execução o campo `test` é lido normalmente (confirmado pelos
// testes rodando). Se um dia as versões de vite convergirem, esta linha para
// de compilar e o @ts-expect-error avisa para removê-la.
export default getViteConfig({ test: {} });
