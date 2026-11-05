import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Next 16 writes an AGENTS.md on dev startup. This prototype doesn't use one.
  agentRules: false,
};

export default nextConfig;
