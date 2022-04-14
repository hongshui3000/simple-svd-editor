import { FC } from 'react';
import { useRouter } from 'next/router';
import { typography, scale, useTheme } from '@scripts/gds';
import { useLinkCSS } from '@scripts/hooks';

type TableEmptyProps = {
    filtersActive: boolean;
    titleWithFilters: string;
    titleWithoutFilters: string;
    addItems?: () => void;
    addItemsText?: string;
};

export const TableEmpty: FC<TableEmptyProps> = ({
    filtersActive,
    titleWithFilters,
    titleWithoutFilters,
    addItems,
    addItemsText,
}) => {
    const { colors } = useTheme();
    const linkStyles = useLinkCSS();
    const { push, pathname } = useRouter();

    return (
        <div css={{ display: 'grid', placeItems: 'center', padding: scale(4), background: colors?.white }}>
            <p css={{ ...typography('h2'), marginBottom: scale(2) }}>
                {filtersActive ? titleWithFilters : titleWithoutFilters}
            </p>
            <p css={{ ...typography('bodyMdBold') }}>
                {filtersActive && (
                    <>
                        Попробуйте изменить или{' '}
                        <button
                            css={linkStyles}
                            type="button"
                            onClick={() => {
                                push(pathname);
                            }}
                        >
                            сбросить фильтры
                        </button>
                    </>
                )}
                {!filtersActive && addItemsText && addItems && (
                    <button
                        css={linkStyles}
                        type="button"
                        onClick={() => {
                            addItems();
                        }}
                    >
                        {addItemsText}
                    </button>
                )}
            </p>
        </div>
    );
};
