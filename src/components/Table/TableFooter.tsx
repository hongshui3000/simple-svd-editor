import { FC } from 'react';
import { useTheme, scale } from '@scripts/gds';
import Pagination from '@components/controls/Pagination';
import Select from '@components/controls/Select';

const ITEMS_PER_PAGE = [
    { label: '10', value: 10 },
    { label: '20', value: 20 },
    { label: '30', value: 30 },
    { label: '40', value: 40 },
    { label: '50', value: 50 },
    { label: '100', value: 100 },
];

type TableFooterProps = {
    itemsPerPageCount: number;
    setItemsPerPageCount: (newItemsPerPageCount: number) => void;
    pages: number;
};

export const TableFooter: FC<TableFooterProps> = ({ itemsPerPageCount, setItemsPerPageCount, pages }) => {
    const { colors } = useTheme();

    return (
        <footer
            css={{
                display: 'grid',
                gridTemplateColumns: '190px 1fr 190px',
                borderTop: `1px solid ${colors?.grey400}`,
                background: colors?.white,
                padding: `${scale(5, true)}px ${scale(2)}px`,
            }}
        >
            <Pagination pages={pages} css={{ gridColumnStart: 2, gridColumnEnd: 3 }} />

            <div
                css={{
                    display: 'flex',
                    alignItems: 'center',
                    marginLeft: 'auto',
                    gridColumnStart: 3,
                    gridColumnEnd: 4,
                    justifySelf: 'end',
                }}
            >
                <label htmlFor="items-per-page" css={{ marginRight: scale(1) }}>
                    Показывать строк
                </label>
                <Select
                    id="items-per-page"
                    name="items-per-page"
                    selectedItem={ITEMS_PER_PAGE.find(i => i.value === itemsPerPageCount)}
                    onChange={selected => setItemsPerPageCount(Number(selected.selectedItem?.value || 0))}
                    placement="top"
                    items={ITEMS_PER_PAGE}
                    simple
                    css={{ width: scale(8) }}
                />
            </div>
        </footer>
    );
};
