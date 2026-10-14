import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // /revision reads the MDX files at request time; ship them with the serverless functions.
  outputFileTracingIncludes: { "/revision": ["./content/lessons/**/*"], "/revision/[id]": ["./content/lessons/**/*"] },
  // El sitio de presentación (HTML estático en public/) vive en la misma dirección que la plataforma.
  async rewrites() {
    return { beforeFiles: [{ source: "/", destination: "/index.html" }, { source: "/precios", destination: "/precios.html" }] };
  },
  async headers() {
    return [
      // El enlace del cliente lleva su token en la dirección: que nunca salga en el Referer ni lo indexen.
      { source: "/c/:path*", headers: [
        { key: "Referrer-Policy", value: "no-referrer" },
        { key: "X-Robots-Tag", value: "noindex, nofollow" },
        { key: "Cache-Control", value: "no-store, private" },
      ] },
    ];
  },
};

export default nextConfig;
