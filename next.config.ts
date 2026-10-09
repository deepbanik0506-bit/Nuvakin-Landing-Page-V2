import type { NextConfig } from "next";

/**
 * Hosts allowed to load dev-server resources (/_next/*, the HMR socket) when the
 * site is opened from another device on the local network, e.g. a phone at
 * http://192.168.1.9:3000. Without this, Next blocks those requests, the page
 * never hydrates, and client-side behaviour silently stops. Development only:
 * production builds ignore this option.
 */
const privateNetworkHosts = [
  "192.168.*.*",
  "10.*.*.*",
  // 172.16.0.0/12
  ...Array.from({ length: 16 }, (_, i) => `172.${16 + i}.*.*`),
  "*.local",
];

const nextConfig: NextConfig = {
  allowedDevOrigins: privateNetworkHosts,
};

export default nextConfig;
