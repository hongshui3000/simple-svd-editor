import { ReactNode } from 'react';
import { CSSObject } from '@emotion/core';
import { typography } from '@scripts/gds';

const TableHead = ({ Header, lineCSS }: { Header: ReactNode; lineCSS: CSSObject }) => (
    <th css={{ ...typography('bodySmBold'), ...lineCSS, textAlign: 'left' }}>{Header}</th>
);

export default TableHead;
