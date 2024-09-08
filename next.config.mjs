/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: '/api/:path*', // Matched parameters can be used in the destination
            },
        ];
    },
};

export default nextConfig;
