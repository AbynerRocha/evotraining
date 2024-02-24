/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/mobile/',
                destination: 'exp://dbjqgqg.abrocha.8081.exp.direct/--/',
                permanent: false,
                basePath: false
            }
        ]
    }
}

module.exports = nextConfig
