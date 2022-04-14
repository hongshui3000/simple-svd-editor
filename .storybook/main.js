const { resolve } = require('path');
const { EnvironmentPlugin } = require(`webpack`);

const resolver = path => resolve(__dirname, path);

module.exports = {
    stories: ['../src/**/intro/welcome.stories.mdx', '../src/**/intro/*.stories.mdx', '../src/**/*.stories.mdx'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        'storybook-addon-paddings',
        // '@storybook/addon-a11y',
        'storybook-addon-next-router',
    ],
    typescript: {
        reactDocgen: 'none',
    },
    webpackFinal: config => {
        // add aliases
        config.resolve.alias = {
            ...config.resolve.alias,
            '@components': resolver('../src/components'),
            '@scripts': resolver('../src/scripts'),
            '@context': resolver('../src/context'),
            '@icons': resolver('../src/icons'),
            '@controls': resolver('../src/components/controls'),
            '@customTypes': resolver('../src/customTypes'),
            '@api': resolver('../src/api'),
        };

        // add env variable support for gds icons autokit
        config.plugins.push(new EnvironmentPlugin({ ICONS_DIR: resolver('../src/icons'), IS_STORYBOOK: true }));

        // add svgr support
        const fileLoaderRule = config.module.rules.find(rule => rule.test && rule.test.test('.svg'));
        fileLoaderRule.exclude = resolver('../src/icons');

        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });

        config.module.rules.push({
            test: /\.scss$/,
            use: ['style-loader', 'css-loader', 'sass-loader'],
        });

        return config;
    },
    babel: async options => {
        options.presets.push('@emotion/babel-preset-css-prop');
        options.plugins.push(['@babel/plugin-proposal-private-property-in-object', { loose: true }], 'react-require');

        return options;
    },
    core: {
        builder: 'webpack5',
    },
    // refs: {
    //     GDS: {
    //         title: 'Greensight Desight System',
    //         url: 'https://greensight.github.io/gds/',
    //     },
    // },
};
