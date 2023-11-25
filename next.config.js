/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        domains: ['drive.google.com', 'lh3.googleusercontent.com']
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                fs: false
            }
        }
        return config
    },
    rewrites: async () => [
        {
            source: '/cmc/:path*',
            destination: 'https://pro-api.coinmarketcap.com/:path*',
        }
    ]

}

module.exports = nextConfig
