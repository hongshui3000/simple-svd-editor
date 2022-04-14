import { FC } from 'react';

import { useTheme, scale } from '@scripts/gds';

import InfoIcon from '@icons/20/info.svg';
import SuccessIcon from '@icons/20/checkCircle.svg';
import ErrorIcon from '@icons/20/closedCircle.svg';
import Tooltip, { TippyProps } from './Component';

type TooltipIconType = 'default' | 'error' | 'success';

export const StyledTooltip: FC<TippyProps & { iconType?: TooltipIconType }> = ({
    iconType = 'default',
    content,
    ...props
}) => {
    const { colors } = useTheme();

    const getIcon = (type: TooltipIconType) => {
        switch (type) {
            case 'error':
                return <ErrorIcon css={{ fill: colors?.danger }} />;
            case 'success':
                return <SuccessIcon css={{ fill: colors?.success }} />;
            default:
                return <InfoIcon css={{ fill: colors?.link }} />;
        }
    };

    return (
        <Tooltip
            content={
                <div
                    css={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        svg: { marginRight: scale(1) },
                    }}
                >
                    {getIcon(iconType)} {content}
                </div>
            }
            {...props}
        />
    );
};
