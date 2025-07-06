/** @type {import('next').NextConfig} */
import NextFederationPlugin from "@module-federation/nextjs-mf";

const remoteNextAppUrl =
  process.env.REMOTE_NEXT_APP_URL || "http://localhost:3001";

const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack(config, options) {
    const { isServer } = options;
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    
    const remotes = {
      mfe: `mfe@${remoteNextAppUrl}/_next/static/chunks/remoteEntry.js`,
    };
    const federatedConfig = {
      name: "host",
      filename: "static/chunks/remoteEntry.js",
      remotes: remotes,
      shared: {
        "styled-components": { singleton: true, eager: true },
      },
      extraOptions: {}, // Add appropriate options here
    };
    config.plugins.push(new NextFederationPlugin(federatedConfig));
    return config;
  },
};

export default nextConfig;
