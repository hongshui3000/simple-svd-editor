import { ThemeProvider, theme, scale } from '../src/scripts/gds';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import Image from 'next/image';
Image = props => <img {...props} />;

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
        hideNoControlsWarning: true,
    },
    viewport: {
        viewports: INITIAL_VIEWPORTS,
    },
    paddings: {
        values: [
            { name: 'None', value: '0' },
            { name: 'Small', value: '16px' },
            { name: 'Medium', value: '32px' },
            { name: 'Large', value: '64px' },
        ],
        default: 'Medium',
    },
    backgrounds: {
        grid: { cellSize: scale(1) },
        values: theme.colors && Object.entries(theme.colors).map(([name, value]) => ({ name, value })),
    },
    options: {
        storySort: {
            order: ['Intro', 'Autokits', 'Components'],
        },
    },
    nextRouter: {
        Provider: RouterContext.Provider,
    },
    parameters: {
        nextRouter: {
            path: '/products/[id]',
            asPath: '/products/catalog',
            query: {
                id: 'catalog',
            },
        },
    },
};

export const decorators = [
    Story => {
        return (
            <ThemeProvider theme={theme}>
                <Story />
            </ThemeProvider>
        );
    },
];
