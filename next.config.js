// const { resolve } = require('path');
const withPlugins = require('next-compose-plugins');
const withSvgr = require('next-plugin-svgr');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
    webpack5: true,
    images: {
        domains: ['es-dev.ensi.tech', 'spoonacular.com', 'picsum.photos', 'es.ensi-dev.greensight.ru'],
    },
    async rewrites() {
        const rewrites = [];
        if (process.env.API_HOST)
            rewrites.push({
                source: '/api/v1/:path*',
                destination: `${process.env.API_HOST}/api/v1/:path*`,
            });
        return rewrites;
    },
    async headers() {
        /** this string is required according to Ensi license */
        return [{ source: '/(.*)', headers: [{ key: 'X-Ensi-Platform', value: '1' }] }];
    },
    swcMinify: true,
};

module.exports = withPlugins(
    [
        withSvgr({
            svgrOptions: {
                svgo: false,
                titleProp: true,
            },
        }),
        withBundleAnalyzer,
    ],
    nextConfig
);
