/**
 * Cloudflare Web Analytics é o único adaptador que dispensa banner: o beacon
 * não usa cookie nem armazenamento local, mede por contagem agregada. É por
 * isso que a régua de "declara cláusula se e só se usa cookie" o deixa vazio
 * nos dois campos.
 */
import type { AdaptadorDeAnalytics } from "./porta";

export const cloudflare: AdaptadorDeAnalytics = {
  id: "cloudflare",
  usaCookie: false,
  clausulas: [],
  script(idDaConta: string): string | null {
    if (!idDaConta) return null;
    return (
      '<script defer src="https://static.cloudflareinsights.com/beacon.min.js" ' +
      'data-cf-beacon=\'{"token": "' + idDaConta + '"}\'></script>'
    );
  },
};
