import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // /revision reads the MDX files at request time; ship them with the serverless functions.
  outputFileTracingIncludes: { "/revision": ["./content/lessons/**/*"], "/revision/[id]": ["./content/lessons/**/*"] },
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
