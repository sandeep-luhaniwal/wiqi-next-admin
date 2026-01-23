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
    turbopack: {},
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false,
                tls: false,
            };
        }
        
        // Fix for leaflet SSR issues
        config.module.rules.push({
            test: /\.m?js$/,
            resolve: {
                fullySpecified: false,
            },
        });
        
        return config;
    },
    transpilePackages: ['leaflet', 'react-leaflet'],
};

export default nextConfig;
