/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'qnknpvkxjxrpanuielhk.supabase.co',
                port: '',
                pathname: '',
            }
        ]
    }
};

module.exports = nextConfig;
