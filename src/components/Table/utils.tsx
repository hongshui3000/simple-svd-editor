import styled from '@emotion/styled';
import { FC } from 'react';
import ArrowDownIcon from '@icons/small/arrowDown.svg';
import { typography, scale, colors } from '@scripts/gds';

export const StyledHeadCell = styled.th({
    ...typography('captionBoldLower'),
    padding: scale(1),
    textAlign: 'left',
    borderTop: `1px solid ${colors.grey400}`,
    borderBottom: `1px solid ${colors.grey400}`,
    whiteSpace: 'nowrap',
    verticalAlign: 'top',
    background: colors?.white,
    height: scale(4),
    '&:first-of-type': { paddingLeft: scale(2) },
    '&:last-of-type': { paddingRight: scale(2) },
});

export const StyledCell = styled.td({
    verticalAlign: 'top',
    padding: scale(1),
    ...typography('bodySm'),
    '&:first-of-type': { paddingLeft: scale(2) },
    '&:last-of-type': { paddingRight: scale(2) },
});

export const StyledRow = styled.tr({
    background: colors.white,
    cursor: 'default !important',
    ':nth-of-type(odd)': { background: colors.grey100 },
    ':hover': { background: colors.lightBlue },
});

export const SortingIcon: FC<{ isSortedDesc: boolean | undefined }> = ({ isSortedDesc }) => (
    <ArrowDownIcon
        css={{
            marginLeft: scale(1),
            marginBottom: -scale(1, true),
            fill: colors?.primary,
            verticalAlign: 'text-bottom',
            transformOrigin: 'center',
            transition: 'transform 0.1s ease-in-out',
            ...(isSortedDesc && {
                transform: 'rotate(-180deg)',
            }),
        }}
    />
);
