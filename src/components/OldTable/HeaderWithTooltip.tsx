import { scale } from '@scripts/gds';
import Tooltip from '@components/controls/Tooltip';
import TipIcon from '@icons/small/status/tip.svg';
import { TippyProps } from '@tippy.js/react';

interface HeaderWithTooltipProps {
    headerText: string;
    tooltipText: string;
    tooltipPlacement?: TippyProps['placement'];
}

const headerWithTooltip = ({ headerText, tooltipText, tooltipPlacement = 'right' }: HeaderWithTooltipProps) => (
    <>
        {headerText}
        <Tooltip content={tooltipText} arrow placement={tooltipPlacement}>
            <button type="button" css={{ verticalAlign: 'bottom', marginLeft: scale(1, true), height: scale(2) }}>
                <TipIcon />
            </button>
        </Tooltip>
    </>
);

export default headerWithTooltip;
