import { withKumaUI } from "@kuma-ui/next-plugin";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['github.com'],
    },
};

export default withKumaUI(nextConfig, {
    outputDir: "./.kuma",
});