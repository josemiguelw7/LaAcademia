import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // /revision reads the MDX files at request time; ship them with the serverless functions.
  outputFileTracingIncludes: { "/revision": ["./content/lessons/**/*"], "/revision/[id]": ["./content/lessons/**/*"] },
};

export default nextConfig;
