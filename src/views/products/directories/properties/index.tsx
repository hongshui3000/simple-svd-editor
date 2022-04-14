import { useState, useMemo, useRef } from 'react';
import Link from 'next/link';

import Block from '@components/Block';
import PageWrapper from '@components/PageWrapper';

import { Button, scale, Layout, typography } from '@scripts/gds';
import { useDebounce, useFieldCSS, useLinkCSS } from '@scripts/hooks';

import PlusIcon from '@icons/small/plus.svg';
import CloseIcon from '@icons/small/closedCircle.svg';
import { Property, useProperties } from '@api/catalog';

const ProductProperties = () => {
    const { basicFieldCSS } = useFieldCSS();
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce<string>(search, 500);

    const linkCSS = useLinkCSS();
    const inputRef = useRef<HTMLInputElement>(null);
    const {
        data: apiData,
        isFetching,
        error,
    } = useProperties({
        filter: { name: debouncedSearch },
    });

    const dict = useMemo(() => {
        if (apiData) {
            const dictTemp = {} as Record<string, Property[]>;
            const collator = new Intl.Collator();

            let firstLetter: string;
            const dataCopy = [...apiData.data];
            dataCopy
                .sort((a, b) => collator.compare(a.name.toLowerCase(), b.name.toLowerCase()))
                .forEach(item => {
                    if (
                        item.name.charAt(0).toUpperCase() !== firstLetter &&
                        /[A-ZА-ЯЁ0-9]/.test(item.name.charAt(0).toUpperCase())
                    ) {
                        firstLetter = item.name.charAt(0).toUpperCase();
                        dictTemp[firstLetter] = [item];
                    } else if (dictTemp[firstLetter]) {
                        dictTemp[firstLetter].push(item);
                    }
                });
            return dictTemp;
        }
    }, [apiData]);

    return (
        <PageWrapper
            h1="Справочник товарных атрибутов"
            isLoading={isFetching}
            error={error ? JSON.stringify(error) : undefined}
        >
            <>
                <Block>
                    <Block.Header>
                        <form css={{ position: 'relative' }}>
                            <label htmlFor="searchAttr" css={{ marginBottom: scale(1), display: 'inline-block' }}>
                                Поиск атрибута
                            </label>
                            <input
                                ref={inputRef}
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                type="text"
                                id="searchAttr"
                                css={basicFieldCSS}
                                placeholder="Введите атрибут..."
                            />
                            {search.length > 0 ? (
                                <button
                                    type="button"
                                    title="Очистить"
                                    css={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        height: scale(7, true),
                                        width: scale(7, true),
                                    }}
                                    onClick={() => {
                                        setSearch('');
                                        inputRef?.current?.focus();
                                    }}
                                >
                                    <CloseIcon />
                                </button>
                            ) : null}
                        </form>
                        <Link href="properties/create" passHref>
                            <Button theme="primary" Icon={PlusIcon}>
                                Создать атрибут
                            </Button>
                        </Link>
                    </Block.Header>
                    <Block.Body>
                        <Layout auto={scale(20)}>
                            {dict && Object.keys(dict).length > 0 ? (
                                Object.keys(dict).map(letter => (
                                    <Layout.Item key={letter} col={1}>
                                        <p css={{ ...typography('bodyMdBold'), marginBottom: scale(2) }}>
                                            {letter.toUpperCase()}
                                        </p>
                                        <ul css={{ listStyleType: 'dash' }}>
                                            {dict[letter].map(i => (
                                                <li key={i.code} css={{ marginBottom: scale(1) }}>
                                                    <Link href={`/products/directories/properties/${i.id}`}>
                                                        <a css={linkCSS}>
                                                            {i.name.slice(0, 1).toUpperCase() + i.name.slice(1)}
                                                        </a>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </Layout.Item>
                                ))
                            ) : (
                                <p>Ничего не найдено</p>
                            )}
                        </Layout>
                    </Block.Body>
                </Block>
            </>
        </PageWrapper>
    );
};

export default ProductProperties;
