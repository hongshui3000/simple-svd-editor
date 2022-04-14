import { FormikValues } from 'formik';
import { Button, scale, Layout } from '@scripts/gds';
import Form from '@components/controls/Form';
import { useMemo } from 'react';
import LoadWrapper from '@components/controls/LoadWrapper';

import { useGetRolesRequests, FORM_FIELDS, SYSTEMS } from './scripts';
import Fields from './Fields';

const UsersFilters = ({
    initialValues,
    onSubmit,
    onReset,
}: {
    initialValues: FormikValues;
    onSubmit: (filters: FormikValues) => void;
    onReset: () => void;
}) => {
    const { useRoles } = useGetRolesRequests(SYSTEMS.ADMIN);
    const { data: rolesApiData, isLoading, error } = useRoles(FORM_FIELDS.ROLE in initialValues);

    const rolesData = useMemo(
        () => (rolesApiData ? rolesApiData.data.map(role => ({ label: role.title, value: role.id })) : undefined),
        [rolesApiData]
    );

    return (
        <LoadWrapper isLoading={isLoading} error={error?.message}>
            <Form initialValues={initialValues} onSubmit={onSubmit} enableReinitialize>
                <Layout cols={5} css={{ marginBottom: scale(2) }}>
                    <Fields initialValues={initialValues} additionalValues={{ role: rolesData }} />
                </Layout>
                <div css={{ display: 'flex', alignItems: 'flex-end' }}>
                    <Form.Reset theme="secondary" type="button" onClick={onReset}>
                        Сбросить
                    </Form.Reset>
                    <Button theme="primary" css={{ marginLeft: scale(2) }} type="submit">
                        Применить
                    </Button>
                </div>
            </Form>
        </LoadWrapper>
    );
};

export default UsersFilters;
