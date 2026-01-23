/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "wiqi-app-assets.s3.me-central-1.amazonaws.com",
            },
        ],
    },
};

export default nextConfig;
