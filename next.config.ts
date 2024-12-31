import { withKumaUI } from "@kuma-ui/next-plugin";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
};

export default withKumaUI(nextConfig, {
    outputDir: "./.kuma",
});