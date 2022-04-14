import { FC, SVGProps } from 'react';

export type SVGRIcon = FC<
    SVGProps<SVGSVGElement> & {
        /** Alternative text in title tag. */
        title?: string;
    }
>;
