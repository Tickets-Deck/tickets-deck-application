/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com'
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com'
            },
            {
                protocol: 'https',
                hostname: 's.gravatar.com'
            },
            {
                protocol: 'https',
                hostname: 'placehold.co'
            },
        ]
    }
}

module.exports = nextConfig