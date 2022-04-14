import { FC } from 'react';

import Form from '@components/controls/Form';

import { scale, Button, useTheme } from '@scripts/gds';

import CrossIcon from '@icons/small/closed.svg';
import SearchIcon from '@icons/small/search.svg';
import { useFieldCSS } from '@scripts/hooks';

export type SearchProps = {
    onSearch: (search: string) => void;
    placeholder?: string;
    className?: string;
};

const Input: FC<any> = ({ field, ...props }) => {
    delete props.meta;
    delete props.helpers;
    const { basicFieldCSS } = useFieldCSS();

    return <input css={{ ...basicFieldCSS, paddingRight: scale(8), width: scale(36) }} {...field} {...props} />;
};

export const Search: FC<SearchProps> = ({ onSearch, ...props }) => {
    const { colors } = useTheme();

    return (
        <Form
            initialValues={{ search: '' }}
            onSubmit={vals => onSearch(vals.search)}
            css={{ position: 'relative', marginRight: scale(1) }}
        >
            {({ values }) => (
                <>
                    <Form.FastField name="search" {...props}>
                        <Input />
                    </Form.FastField>
                    <div
                        css={{
                            position: 'absolute',
                            top: 4,
                            right: 2,
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        {values?.search?.length > 0 && (
                            <>
                                <Form.Reset
                                    type="button"
                                    theme="ghost"
                                    size="sm"
                                    hidden
                                    Icon={CrossIcon}
                                    css={{ ':hover': { background: 'transparent !inherit' } }}
                                >
                                    Очистить
                                </Form.Reset>
                                <span
                                    css={{
                                        height: scale(2),
                                        width: 1,
                                        background: colors?.grey400,
                                    }}
                                />
                            </>
                        )}
                        <Button
                            type="submit"
                            theme="ghost"
                            size="sm"
                            hidden
                            Icon={SearchIcon}
                            css={{ ':hover': { background: 'transparent !inherit' } }}
                        >
                            Поиск
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
};
