import type { MetadataRoute } from "next";

/** La plataforma instalable: ícono en la pantalla de inicio y se abre sin barra del navegador. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Liliana Miranda · La Academia",
    short_name: "La Academia",
    description: "Aprende a preparar impuestos, paso a paso, con Liliana Miranda.",
    lang: "es",
    start_url: "/curso",
    scope: "/",
    display: "standalone",
    background_color: "#F4F1EC",
    theme_color: "#F4F1EC",
    icons: [
      { src: "/app/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/app/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/app/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
