import { FC, HTMLProps } from 'react';
import { scale } from '@scripts/gds';

export type BodyProps = HTMLProps<HTMLDivElement>;

export const Body: FC<BodyProps> = props => <div css={{ padding: scale(3), flexGrow: 1, flexShrink: 0 }} {...props} />;

export default Body;
