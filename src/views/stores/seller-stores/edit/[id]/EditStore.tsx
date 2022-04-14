import { useCallback } from 'react';

import Block from '@components/Block';
import Autocomplete from '@components/controls/Autocomplete';
import { loadAddresses } from '@api/dadata';

import Form from '@components/controls/Form';
import Switcher from '@components/controls/Switcher';
import Select from '@components/controls/Select';

import { useTimezones } from '@scripts/hooks';
import { Layout, Button, scale } from '@scripts/gds';

import { SellerFilter, Seller } from '@api/units';
import { CommonResponse } from '@api/common/types';
import { apiClient } from '@api/index';
import { FormikValues } from 'formik';

interface EditStoreProps {
    className?: string;
    needBtns?: boolean;
    initialValues: FormikValues;
}

const EditStore = ({ className, needBtns = true, initialValues }: EditStoreProps) => {
    const timezones = useTimezones();

    const loadSellers = useCallback(async (inputValue?: string) => {
        try {
            const data: { filter: Partial<SellerFilter> } = { filter: { legal_name: inputValue || '' } };
            const apiSellers: CommonResponse<Seller[]> = await apiClient.post('units/sellers:search', { data });
            return apiSellers.data?.map(s => ({ label: s.legal_name || +s.id, value: s.id })) || [];
        } catch (err) {
            return [];
        }
    }, []);
    return (
        <Block className={className}>
            <Block.Body>
                <Layout cols={3} css={{ maxWidth: scale(128) }}>
                    <Layout.Item col={3}>
                        <Form.Field name="seller_id" label="Продавец">
                            <Autocomplete searchAsyncFunc={loadSellers} />
                        </Form.Field>
                    </Layout.Item>
                    <Layout.Item col={2}>
                        <Form.Field name="name" label="Название склада" />
                    </Layout.Item>
                    <Layout.Item col={1}>
                        <Form.Field name="code" label="Внешний код" />
                    </Layout.Item>
                    <Layout.Item col={3}>
                        <Form.Field name="address" label="Адрес" hint="Начните вводить адрес">
                            <Autocomplete searchAsyncFunc={loadAddresses} />
                        </Form.Field>
                    </Layout.Item>
                    <Layout.Item col={1}>
                        <Form.Field name="porch" label="Подъезд" />
                    </Layout.Item>
                    <Layout.Item col={1}>
                        <Form.Field name="floor" label="Этаж" />
                    </Layout.Item>
                    <Layout.Item col={1}>
                        <Form.Field name="intercom" label="Домофон" />
                    </Layout.Item>
                    <Layout.Item col={3}>
                        <Form.Field name="comment" label="Комментарий к адресу" />
                    </Layout.Item>
                    <Layout.Item col={3}>
                        <Form.Field name="timezone" label="Таймзона">
                            <Select items={timezones} />
                        </Form.Field>
                    </Layout.Item>
                    <Layout.Item col={1}>
                        <Form.Field name="active">
                            <Switcher>Активен</Switcher>
                        </Form.Field>
                    </Layout.Item>
                </Layout>
            </Block.Body>
            {needBtns ? (
                <Block.Footer css={{ justifyContent: 'flex-end' }}>
                    <Form.Reset theme="secondary" css={{ marginRight: scale(2) }} initialValues={initialValues}>
                        Отменить
                    </Form.Reset>
                    <Button theme="primary" type="submit">
                        Добавить
                    </Button>
                </Block.Footer>
            ) : null}
        </Block>
    );
};

export default EditStore;
