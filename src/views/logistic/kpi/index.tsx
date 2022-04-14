import { useMemo } from 'react';

import Block from '@components/Block';
import PageWrapper from '@components/PageWrapper';

import Tabs from '@components/controls/Tabs';

import { useTabs } from '@scripts/hooks';

import {
    useDeliveryKpi,
    useDeliveryKpiChange,
    useDeliveryKpiCt,
    useDeliveryKpiCtCreate,
    useDeliveryKpiCtEdit,
    useDeliveryKpiCtDelete,
    useDeliveryKpiPpt,
    useDeliveryKpiPptCreate,
    useDeliveryKpiPptEdit,
    useDeliveryKpiPptDelete,
    useDeliveryServices,
    useDeliveryServiceChange,
} from '@api/logistic';
import { loadSellers, useGetSellers } from '@api/units';

import FormMaker from './FormMaker';
import CommonSettings from './CommonSettings';

const LogisticKPI = () => {
    const { getTabsProps } = useTabs();

    const { data: apiCommon, isLoading, error } = useDeliveryKpi();

    const kpiCommon = useMemo(
        () =>
            apiCommon?.data || {
                rtg: '',
                ct: '',
                ppt: '',
            },
        [apiCommon]
    );

    const { data: apiSellersCt } = useDeliveryKpiCt();

    const kpiCt = useMemo(() => apiSellersCt?.data || [], [apiSellersCt]);

    const { data: apiUnitsSellers } = useGetSellers();

    const sellers = useMemo(
        () => apiUnitsSellers?.data.map(item => ({ value: `${item.id}`, label: `${item.legal_name}` })) || [],
        [apiUnitsSellers]
    );

    const preparedCtSellers = useMemo(
        () =>
            kpiCt?.map(item => ({
                name: sellers.find(i => +i.value === item.seller_id)?.label || `id:${item.seller_id}`,
                value: item.ct,
                id: item.seller_id,
            })) || [],
        [sellers, kpiCt]
    );

    const changeDeliveryKpi = useDeliveryKpiChange();
    const createDeliveryKpiCt = useDeliveryKpiCtCreate();
    const editDeliveryKpiCt = useDeliveryKpiCtEdit();
    const deleteDeliveryKpiCt = useDeliveryKpiCtDelete();

    const createDeliveryKpiPpt = useDeliveryKpiPptCreate();
    const editDeliveryKpiPpt = useDeliveryKpiPptEdit();
    const deleteDeliveryKpiPpt = useDeliveryKpiPptDelete();

    const editDeliveryService = useDeliveryServiceChange();

    const { data: apiSellersPpt } = useDeliveryKpiPpt();

    const kpiPpt = useMemo(() => apiSellersPpt?.data || [], [apiSellersPpt]);

    const preparedPptSellers = useMemo(
        () =>
            kpiPpt?.map(item => ({
                name: sellers.find(i => +i.value === item.seller_id)?.label || `id:${item.seller_id}`,
                value: item.ppt,
                id: item.seller_id,
            })) || [],
        [sellers, kpiPpt]
    );

    const { data: apiServices } = useDeliveryServices({ pagination: { type: 'offset', limit: -1, offset: 0 } });
    const deliveryServices = useMemo(
        () => apiServices?.data.map(item => ({ value: `${item.id}`, label: `${item.name}` })) || [],
        [apiServices?.data]
    );
    const preparedDeliveryServices = useMemo(
        () =>
            apiServices?.data
                .filter(item => item.pct && item.pct > 0)
                .map(item => ({
                    name: `${item.name}`,
                    value: item.pct || 0,
                    id: item.id,
                })) || [],
        [apiServices?.data]
    );

    return (
        <PageWrapper
            h1="Планировщик времени статусов"
            isLoading={isLoading}
            error={error ? JSON.stringify(error) : undefined}
        >
            <Tabs {...getTabsProps()}>
                <Tabs.List>
                    <Tabs.Tab>Общие настройки</Tabs.Tab>
                    <Tabs.Tab>CT для продавцов</Tabs.Tab>
                    <Tabs.Tab>PPT для продавцов</Tabs.Tab>
                    <Tabs.Tab>PCT для логистических операторов</Tabs.Tab>
                </Tabs.List>
                <Block>
                    <Block.Body>
                        <Tabs.Panel>
                            <CommonSettings
                                initialValues={kpiCommon}
                                onSubmit={values => {
                                    changeDeliveryKpi.mutate({
                                        rtg: values.rtg,
                                        ct: values.ct,
                                        ppt: values.ppt,
                                    });
                                }}
                            />
                        </Tabs.Panel>
                        <Tabs.Panel>
                            <FormMaker
                                name="Продавец"
                                value="CT (мин)"
                                tooltipText="Confirmation Time - время перехода Отправления из статуса “Ожидает подтверждения” в статус “На комплектации”"
                                loadSuggestions={loadSellers}
                                onSubmit={values => {
                                    const itemsToCreate = values.list.filter(
                                        (item: any) => !preparedCtSellers.find(i => i.name === item.name)
                                    );

                                    const itemsToEdit = values.list.filter((item: any) => {
                                        const existingItem = preparedCtSellers.find(i => i.name === item.name);
                                        return existingItem && existingItem.value !== item.value;
                                    });

                                    const itemsToDelete = preparedCtSellers.filter(
                                        item => !values.list.find((i: any) => i.name === item.name)
                                    );

                                    itemsToCreate.forEach((item: any) => {
                                        createDeliveryKpiCt.mutate({
                                            seller_id: item.id,
                                            ct: item.value,
                                        });
                                    });

                                    itemsToEdit.forEach((item: any) => {
                                        editDeliveryKpiCt.mutate({
                                            seller_id: item.id,
                                            ct: item.value,
                                        });
                                    });

                                    itemsToDelete.forEach((item: any) => {
                                        deleteDeliveryKpiCt.mutate(+item.id);
                                    });
                                }}
                                initialValues={{
                                    list: preparedCtSellers,
                                }}
                            />
                        </Tabs.Panel>
                        <Tabs.Panel>
                            <FormMaker
                                name="Продавец"
                                value="PPT (мин)"
                                tooltipText="Planned Processing Time - плановое время для прохождения Отправлением статусов от “На комплектации” до “Готов к передаче ЛО”"
                                loadSuggestions={loadSellers}
                                onSubmit={values => {
                                    const itemsToCreate = values.list.filter(
                                        (item: any) => !preparedPptSellers.find(i => i.name === item.name)
                                    );

                                    const itemsToEdit = values.list.filter((item: any) => {
                                        const existingItem = preparedPptSellers.find(i => i.name === item.name);
                                        return existingItem && existingItem.value !== item.value;
                                    });

                                    const itemsToDelete = preparedPptSellers.filter(
                                        item => !values.list.find((i: any) => i.name === item.name)
                                    );

                                    itemsToCreate.forEach((item: any) => {
                                        createDeliveryKpiPpt.mutate({
                                            seller_id: item.id,
                                            ppt: item.value,
                                        });
                                    });

                                    itemsToEdit.forEach((item: any) => {
                                        editDeliveryKpiPpt.mutate({
                                            seller_id: item.id,
                                            ppt: item.value,
                                        });
                                    });

                                    itemsToDelete.forEach((item: any) => {
                                        deleteDeliveryKpiPpt.mutate(+item.id);
                                    });
                                }}
                                initialValues={{
                                    list: preparedPptSellers,
                                }}
                            />
                        </Tabs.Panel>
                        <Tabs.Panel>
                            <FormMaker
                                name="Служба доставки"
                                value="PCT (мин)"
                                tooltipText="Planned Сonsolidation Time - плановое время доставки заказа от склада продавца до логистического хаба ЛО и обработки заказа в сортировочном центре или хабе на стороне ЛО"
                                selectProps={{ items: deliveryServices }}
                                initialValues={{
                                    list: preparedDeliveryServices,
                                }}
                                onSubmit={values => {
                                    const itemsToDelete = preparedDeliveryServices.filter(
                                        item => !values.list.find((i: any) => i.name === item.name)
                                    );

                                    values.list.forEach((item: { name: string; value: number; id: number }) => {
                                        editDeliveryService.mutate({
                                            id: item.id,
                                            pct: item.value,
                                        });
                                    });
                                    itemsToDelete.forEach((item: any) => {
                                        editDeliveryService.mutate({
                                            id: item.id,
                                            pct: 0,
                                        });
                                    });
                                }}
                            />
                        </Tabs.Panel>
                    </Block.Body>
                </Block>
            </Tabs>
        </PageWrapper>
    );
};

export default LogisticKPI;
