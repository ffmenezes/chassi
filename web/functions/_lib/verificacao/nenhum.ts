/**
 * Inerte: sem segredo configurado, o formulário funciona e não há anti-spam.
 * É o padrão de propósito — o chassi tem de rodar sem conta nenhuma. Quem
 * publica sem configurar o Turnstile vai receber spam, e o README diz isso
 * com todas as letras.
 */
export const verificarPorNenhum = async (): Promise<boolean> => true;
