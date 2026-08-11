import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Formatos next-gen por content negotiation: Next sirve AVIF al navegador
    // que lo acepte, WebP al que no, y el original como último recurso.
    formats: ["image/avif", "image/webp"],
    // Anchos que se generan; cubren móvil (390@2x) hasta desktop grande.
    deviceSizes: [390, 640, 828, 1080, 1200, 1440, 1920, 2560],
    // Un año de caché: el hash del archivo cambia si la imagen cambia.
    minimumCacheTTL: 31_536_000,
  },
};

export default nextConfig;
