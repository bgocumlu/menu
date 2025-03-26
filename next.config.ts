import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn.yemek.com",
            },
        ],
    },
};

export default nextConfig;
