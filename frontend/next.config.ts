import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bundles only the necessary files and dependencies into a minimized directory
  output: "standalone"
};

export default nextConfig;
