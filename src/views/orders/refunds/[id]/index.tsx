import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import * as Yup from 'yup';

import { useTabs, useLinkCSS } from '@scripts/hooks';
import { Button, scale, useTheme, Layout } from '@scripts/gds';
import { formatPrice, fromKopecksToRouble, prepareTelValue, toSelectItems, getOptionName } from '@scripts/helpers';
import { ErrorMessages, ModalMessages } from '@scripts/constants';

import {
    useOrderSources,
    useRefund,
    usePatchRefund,
    useRefundAddFile,
    useRefundDeleteFiles,
    RefundStatuses,
    useRefundStatuses,
} from '@api/orders';
import { useCustomer } from '@api/customers';
import { downloadFile } from '@api/common';

import PageWrapper from '@components/PageWrapper';
import Table, { ExtendedColumn, Cell } from '@components/Table';
import Form from '@components/controls/Form';
import Tabs from '@components/controls/Tabs';
import Autocomplete from '@components/controls/Autocomplete';
import { useAdminUser, getAdminUserEnumValues } from '@api/units';
import Dropzone from '@components/controls/Dropzone';
import { FileType } from '@components/controls/Dropzone/DropzoneFile';

import { useError, useSuccess } from '@context/modal';

import CheckIcon from '@icons/small/check.svg';
import KebabIcon from '@icons/small/kebab.svg';

import { FormikProps, FormikValues } from 'formik';
import Tooltip, { ContentBtn } from '@components/controls/Tooltip';
import Popup from '@components/controls/Popup';
import Block from '@components/Block';
import Label from '@components/Label';

import Select from '@components/controls/Select';
import Textarea from '@components/controls/Textarea';
import { Aside } from './Aside';

const columns: ExtendedColumn[] = [
    {
        accessor: 'photo',
        Header: 'Фото',
        Cell: ({ value }) => <Cell value={value} type="photo" />,
    },
    {
        accessor: 'name',
        Header: 'Название и артикул',
        Cell: ({ value }) => {
            const linkStyles = useLinkCSS();
            const { colors } = useTheme();
            return (
                <>
                    <p css={{ marginBottom: scale(1) }}>
                        <Link passHref href={value.link}>
                            <a css={linkStyles}>{value.name}</a>
                        </Link>
                    </p>
                    <p css={{ color: colors?.grey700 }}>{value.barcode}</p>
                </>
            );
        },
    },
    {
        accessor: 'price',
        Header: 'Цена и цена без скидки,  ₽',
        Cell: ({ value }: { value: number[] }) => {
            const { colors } = useTheme();
            return value.map((v, index) => (
                <p css={index > 0 && { color: colors?.grey700 }}>
                    <Cell key={index} value={v} type="price" />
                </p>
            ));
        },
    },
    {
        accessor: 'quantity',
        Header: 'Количество',
    },
    {
        accessor: 'count',
        Header: 'Наличие',
    },
    {
        accessor: 'cost',
        Header: 'Стоимость,  ₽',
        Cell: ({ value }) => <Cell value={value} type="price" />,
    },
];

export default function RefundsPage() {
    const { colors } = useTheme();
    const { query } = useRouter();
    const refundId = (query && query.id && +query.id) || 0;
    const { getTabsProps } = useTabs();

    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const closeStatusPopup = useCallback(() => setIsStatusOpen(false), []);

    const { data, isIdle, isLoading, error } = useRefund(refundId, ['files', 'items', 'order', 'reasons']);
    const { data: sourcesData } = useOrderSources();

    const refund = useMemo(() => data?.data, [data?.data]);
    const { data: customerData } = useCustomer(refund?.order.customer_id);
    const { data: responsible } = useAdminUser(refund?.responsible_id);
    const { data: author } = useAdminUser(refund?.manager_id);

    const patchRefund = usePatchRefund();
    const addFile = useRefundAddFile();
    const deleteFiles = useRefundDeleteFiles();
    const { data: statusData } = useRefundStatuses();

    useError(error);
    useError(patchRefund.error);
    useSuccess(patchRefund.status === 'success' ? ModalMessages.SUCCESS_UPDATE : '');
    useError(addFile.error);
    useSuccess(addFile.status === 'success' ? ModalMessages.SUCCESS_SAVE : '');
    useError(deleteFiles.error);
    useSuccess(deleteFiles.status === 'success' ? ModalMessages.SUCCESS_DELETE : '');

    const initialValues = useMemo(
        () => ({
            files_to_delete: [] as number[],
            files: (refund?.files?.map(f => ({ id: f.id, name: f.original_name, file: f.file })) || []) as FileType[],
            responsible_id: { value: refund?.responsible_id, label: responsible?.data.full_name },
        }),
        [responsible?.data.full_name, refund?.files, refund?.responsible_id]
    );

    const products = useMemo(
        () =>
            refund?.items?.map(item => ({
                id: item.id,
                photo: item.product?.images[0]?.file,
                name: {
                    name: item.name,
                    code: item.product_data?.barcode,
                    link: `/products/catalog/${item.product_data.external_id}`,
                },
                price: [item.price_per_one, item.cost_per_one],
                quantity: item.qty,
                cost: item.price,
            })) || [],
        [refund?.items]
    );

    return (
        <PageWrapper h1={`Заявка на возврат ${refund?.id || ''}`} isLoading={isIdle || isLoading}>
            <Form
                initialValues={initialValues}
                enableReinitialize
                onSubmit={vals => {
                    if (initialValues.responsible_id.value !== vals.responsible_id.value) {
                        patchRefund.mutate({
                            id: refundId,
                            responsible_id: vals.responsible_id.value,
                        });
                    }
                    if (vals.files_to_delete.length > 0) {
                        deleteFiles.mutate({
                            id: refundId,
                            file_ids: vals.files_to_delete,
                        });
                    }
                    vals.files.forEach((file: FileType) => {
                        if (!file.id) {
                            addFile.mutate({ id: refundId, file });
                        }
                    });
                }}
                css={{ position: 'relative' }}
            >
                {({ dirty, values, setFieldValue }: FormikProps<FormikValues>) => (
                    <>
                        <div
                            css={{
                                display: 'flex',
                                position: 'absolute',
                                top: '-40px',
                                right: 0,
                                background: colors?.white,
                                padding: scale(1),
                            }}
                        >
                            {refund?.status === RefundStatuses.NEW && (
                                <Tooltip
                                    trigger="click"
                                    theme="light"
                                    arrow
                                    placement="bottom-end"
                                    minWidth={scale(36)}
                                    content={
                                        <ul>
                                            <li>
                                                <ContentBtn type="edit" onClick={() => setIsStatusOpen(true)}>
                                                    Изменить статус заявки
                                                </ContentBtn>
                                            </li>
                                        </ul>
                                    }
                                >
                                    <Button
                                        theme="secondary"
                                        Icon={KebabIcon}
                                        iconAfter
                                        css={{ marginRight: scale(1) }}
                                    >
                                        Действия
                                    </Button>
                                </Tooltip>
                            )}
                            {dirty && (
                                <Form.Reset theme="dangerous" css={{ marginRight: scale(1) }}>
                                    Отменить
                                </Form.Reset>
                            )}
                            <Button type="submit" Icon={CheckIcon} iconAfter disabled={!dirty}>
                                Сохранить
                            </Button>
                        </div>
                        <div css={{ display: 'flex', gap: scale(2) }}>
                            <div css={{ flexGrow: 1, flexShrink: 1 }}>
                                <Tabs {...getTabsProps()}>
                                    <Tabs.List>
                                        <Tabs.Tab>Главное</Tabs.Tab>
                                        <Tabs.Tab>Товары</Tabs.Tab>
                                        <Tabs.Tab>Вложения</Tabs.Tab>
                                    </Tabs.List>
                                    <Tabs.Panel>
                                        <Block css={{ borderTopLeftRadius: 0 }}>
                                            <Block.Body>
                                                <Layout cols={2}>
                                                    <Layout.Item col={2}>
                                                        <Form.Field label="Ответственный" name="responsible_id">
                                                            <Autocomplete searchAsyncFunc={getAdminUserEnumValues} />
                                                        </Form.Field>
                                                    </Layout.Item>
                                                    <Layout.Item col={1}>
                                                        <Label>Клиент</Label>
                                                        <p>
                                                            {`${customerData?.data.last_name} ${customerData?.data.first_name} ${customerData?.data.middle_name}`}
                                                        </p>

                                                        <p>
                                                            <a href={`tel:${customerData?.data.phone}`}>
                                                                {prepareTelValue(customerData?.data.phone || '')}
                                                            </a>
                                                        </p>
                                                        <p>
                                                            <a href={`mailto:${customerData?.data.email}`}>
                                                                {customerData?.data.email}
                                                            </a>
                                                        </p>
                                                    </Layout.Item>

                                                    {refund?.manager_id && (
                                                        <Layout.Item col={1}>
                                                            <Label>Автор</Label>
                                                            {author?.data.full_name}
                                                        </Layout.Item>
                                                    )}
                                                    <Layout.Item col={1}>
                                                        <Label>Канал</Label>
                                                        {getOptionName(sourcesData?.data, refund?.source)}
                                                    </Layout.Item>

                                                    <Layout.Item col={1}>
                                                        <Label>Сумма возврата</Label>
                                                        {formatPrice(fromKopecksToRouble(refund?.price || 0))} ₽
                                                    </Layout.Item>

                                                    <Layout.Item col={1}>
                                                        <Label>Причина возврата</Label>
                                                        {new Intl.ListFormat('ru').format(
                                                            refund?.reasons.map(r => r.name) || []
                                                        )}
                                                    </Layout.Item>
                                                    <Layout.Item col={1}>
                                                        <Label>Комментарий</Label>
                                                        {refund?.user_comment}
                                                    </Layout.Item>
                                                    {refund?.rejection_comment && (
                                                        <Layout.Item col={1}>
                                                            <Label>Причина отклонения</Label>
                                                            {refund?.rejection_comment}
                                                        </Layout.Item>
                                                    )}
                                                    {/* Способ возврата Не реализовано на бэкенде */}
                                                    {/* Иноформация о возврате Не реализовано на бэкенде */}
                                                </Layout>
                                            </Block.Body>
                                        </Block>
                                    </Tabs.Panel>
                                    <Tabs.Panel>
                                        <Block>
                                            <Block.Body>
                                                <Table
                                                    columns={columns}
                                                    data={products}
                                                    allowRowSelect={false}
                                                    disableSortBy
                                                />
                                            </Block.Body>
                                        </Block>
                                    </Tabs.Panel>
                                    <Tabs.Panel>
                                        <Block>
                                            <Block.Body>
                                                <Form.Field label="Прикрепите вложения" name="files">
                                                    <Dropzone
                                                        onFileRemove={(index, file) => {
                                                            if (file?.id) {
                                                                setFieldValue('files_to_delete', [
                                                                    ...values.files_to_delete,
                                                                    file?.id,
                                                                ]);
                                                            }
                                                        }}
                                                        onFileClick={f => downloadFile(f.file, f.name)}
                                                    />
                                                </Form.Field>
                                            </Block.Body>
                                        </Block>
                                    </Tabs.Panel>
                                </Tabs>
                            </div>

                            <Aside refund={refund} css={{ marginTop: scale(6) }} />
                        </div>
                    </>
                )}
            </Form>
            <Popup isOpen={isStatusOpen} onRequestClose={closeStatusPopup} title="Изменить статус заявки">
                <Form
                    initialValues={{ status: '', rejection_comment: '' }}
                    onSubmit={vals => {
                        patchRefund.mutate({
                            id: refundId,
                            status: +vals.status,
                            rejection_comment: vals.rejection_comment || undefined,
                        });
                        closeStatusPopup();
                    }}
                    css={{ width: scale(50) }}
                    validationSchema={Yup.object().shape({
                        status: Yup.number().required(ErrorMessages.REQUIRED),
                        rejection_comment: Yup.string().when('status', {
                            is: (status: number) => status === RefundStatuses.REJECTED,
                            then: Yup.string().required(ErrorMessages.REQUIRED),
                            otherwise: Yup.string(),
                        }),
                    })}
                >
                    {({ values }: FormikProps<FormikValues>) => (
                        <>
                            <Popup.Body>
                                <Form.Field label="Выберите статус" name="status" css={{ marginBottom: scale(2) }}>
                                    <Select
                                        simple
                                        items={toSelectItems(
                                            statusData?.data.filter(
                                                s =>
                                                    s.id === RefundStatuses.CONFIRMED ||
                                                    s.id === RefundStatuses.REJECTED
                                            )
                                        )}
                                    />
                                </Form.Field>
                                {values.status === RefundStatuses.REJECTED && (
                                    <Form.FastField label="Причина отклонения" name="rejection_comment">
                                        <Textarea minRows={3} />
                                    </Form.FastField>
                                )}
                            </Popup.Body>
                            <Popup.Footer>
                                <Button theme="secondary" onClick={closeStatusPopup}>
                                    Закрыть
                                </Button>
                                {values.status === RefundStatuses.REJECTED && (
                                    <Button theme="dangerous" type="submit">
                                        Отменить заказ
                                    </Button>
                                )}
                                {values.status === RefundStatuses.CONFIRMED && (
                                    <Button type="submit">Подтвердить заказ</Button>
                                )}
                            </Popup.Footer>
                        </>
                    )}
                </Form>
            </Popup>
        </PageWrapper>
    );
}
