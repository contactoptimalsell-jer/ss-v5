import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Projet séparé - pas de basePath nécessaire
  // Le routing vers /training sera géré par les rewrites dans skillshield-ai-4/vercel.json
  output: "standalone",
};

export default nextConfig;
