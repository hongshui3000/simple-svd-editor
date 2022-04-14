import { FC, HTMLAttributes } from 'react';
import { typography, scale } from '@scripts/gds';

const Label: FC<HTMLAttributes<HTMLParagraphElement>> = props => (
    <p css={{ ...typography('bodySmBold'), marginBottom: scale(1) }} {...props} />
);

export default Label;
