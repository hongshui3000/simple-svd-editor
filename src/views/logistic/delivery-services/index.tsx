import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { FormikValues } from 'formik';

import { Button, scale, Layout } from '@scripts/gds';
import OldTable from '@components/OldTable';
import Block from '@components/Block';
import PageWrapper from '@components/PageWrapper';
import Form from '@components/controls/Form';
import Pagination from '@components/controls/Pagination';
import Select from '@components/controls/Select';

import { LIMIT_PAGE } from '@scripts/constants';
import { getTotalPages } from '@scripts/helpers';

import { useDeliveryServices, useDeliveryStatuses } from '@api/logistic';

import { useFiltersHelper } from '@scripts/hooks';
import { useError } from '@context/modal';

const COLUMNS = [
    {
        Header: 'ID',
        accessor: 'id',
        getProps: () => ({ type: 'linkedID' }),
    },
    {
        Header: 'Название',
        accessor: 'name',
    },
    {
        Header: 'Статус',
        accessor: 'statusName',
    },
    {
        Header: 'Приоритет',
        accessor: 'priority',
    },
];

const emptyInitialValues = {
    id: '',
    name: '',
    status: '',
};

const DeliveryServicesFilter = ({
    initialValues,
    statuses,
    onSubmit,
    onReset,
}: {
    initialValues: FormikValues;
    statuses: { label: string; value: string }[];
    onSubmit: (filters: FormikValues) => void;
    onReset: () => void;
}) => (
    <Block css={{ marginBottom: scale(3) }}>
        <Form initialValues={initialValues} onSubmit={onSubmit} onReset={onReset}>
            <Block.Body>
                <Layout cols={3}>
                    <Layout.Item col={1}>
                        <Form.Field name="id" label="ID" type="number" />
                    </Layout.Item>
                    <Layout.Item col={1}>
                        <Form.Field name="name" label="Название" />
                    </Layout.Item>
                    <Layout.Item col={1}>
                        <Form.Field name="status" label="Статус">
                            <Select items={statuses} />
                        </Form.Field>
                    </Layout.Item>
                </Layout>
            </Block.Body>
            <Block.Footer css={{ justifyContent: 'flex-end' }}>
                <div>
                    <Button theme="primary" type="submit">
                        Применить
                    </Button>
                    <Form.Reset
                        css={{ marginLeft: scale(2) }}
                        theme="secondary"
                        type="button"
                        initialValues={emptyInitialValues}
                    >
                        Сбросить
                    </Form.Reset>
                </div>
            </Block.Footer>
        </Form>
    </Block>
);

const DeliveryServices = () => {
    const { pathname, query, push } = useRouter();
    const activePage = +(query?.page || 1);
    const { initialValues, URLHelper } = useFiltersHelper(emptyInitialValues);

    const {
        data: apiData,
        isLoading,
        error,
    } = useDeliveryServices({
        filter: {
            id: initialValues.id || undefined,
            name: initialValues.name || undefined,
            status: initialValues.status || undefined,
        },
        pagination: { type: 'offset', limit: LIMIT_PAGE, offset: (activePage - 1) * LIMIT_PAGE },
    });

    const { data: apiStatuses, error: apiStatusesError } = useDeliveryStatuses();
    useError(error || apiStatusesError);

    const statuses = useMemo(
        () =>
            apiStatuses && apiStatuses.data && apiStatuses.data.length > 0
                ? apiStatuses.data.map(i => ({ label: i.name, value: `${i.id}` }))
                : [],
        [apiStatuses]
    );

    const columnsData = useMemo(
        () =>
            apiData?.data?.map(item => ({
                ...item,
                statusName: statuses.find(status => +status.value === item.status)?.label,
            })) || [],
        [apiData, statuses]
    );

    const totalPages = getTotalPages(apiData);

    return (
        <PageWrapper
            h1="Логистические операторы"
            isLoading={isLoading}
            error={error ? JSON.stringify(error) : undefined}
        >
            <DeliveryServicesFilter
                initialValues={initialValues}
                statuses={statuses}
                onSubmit={URLHelper}
                onReset={() => push(pathname)}
            />

            <Block>
                <Block.Body>
                    {columnsData.length > 0 ? (
                        <OldTable
                            columns={COLUMNS}
                            data={columnsData}
                            needCheckboxesCol={false}
                            needSettingsColumn={false}
                        />
                    ) : (
                        <p>Логистические операторы не найдены</p>
                    )}
                    <Pagination pages={totalPages} />
                </Block.Body>
            </Block>
        </PageWrapper>
    );
};

export default DeliveryServices;

export async function getServerSideProps() {
    return {
        props: {},
    };
}
