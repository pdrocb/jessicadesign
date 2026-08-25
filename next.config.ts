import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Formatos next-gen por content negotiation: Next sirve AVIF al navegador
    // que lo acepte, WebP al que no, y el original como último recurso.
    formats: ["image/avif", "image/webp"],
    // Anchos que se generan; cubren móvil (390@2x) hasta desktop grande.
    // El tope es 1920 y no 2560 a propósito: ninguna fuente en assets/
    // supera los 1920px (ver scripts/optimize-assets.mjs, que las recorta
    // a 2000 de lado largo). Pedir 2560 solo generaba una transformación
    // más en Vercel que devolvía exactamente los mismos píxeles.
    deviceSizes: [390, 640, 828, 1080, 1200, 1440, 1920],
    // Un año de caché: el hash del archivo cambia si la imagen cambia.
    minimumCacheTTL: 31_536_000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
