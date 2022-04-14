declare module '*.svg' {
    import { SVGRIcon } from '@customTypes/index';

    const SVG: SVGRIcon;
    export default SVG;
}

declare module 'react-loading-skeleton';
declare module 'react-imask';
declare module 'react-tabs';
declare module '@emotion/core/jsx-runtime';

type ListFormatOptions = {
    type?: 'conjunction' | 'disjunction' | 'unit';
    style?: 'long' | 'short' | 'narrow';
    localeMatcher?: 'lookup' | 'best fit';
};
declare namespace Intl {
    class ListFormat {
        constructor(locale: string, options?: ListFormatOptions);

        public format: (items: Array<string>) => string;
    }
}
