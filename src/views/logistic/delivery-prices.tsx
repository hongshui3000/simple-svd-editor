import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';

import OldTable from '@components/OldTable';
import Block from '@components/Block';
import PageWrapper from '@components/PageWrapper';
import LoadWrapper from '@components/controls/LoadWrapper';

import Form from '@components/controls/Form';
import Tabs from '@components/controls/Tabs';
import Popup from '@components/controls/Popup';
import Select, { SelectItemProps } from '@components/controls/Select';

import { Button, scale } from '@scripts/gds';
import { usePopupState, useTabs } from '@scripts/hooks';
import { ActionType, CELL_TYPES, DeliveryMethods } from '@scripts/enums';
import { fromKopecksToRouble, fromRoubleToKopecks } from '@scripts/helpers';

import {
    useDeliveryServices,
    useDeliveryPrices,
    useDeliveryPriceCreate,
    useFederalDistricts,
    useRegions,
    useDeliveryPriceChange,
    useDeleteDeliveryPrice,
} from '@api/logistic';

type District = {
    id: number;
    subject?: string;
    federal_district_id: number;
    pickupPrice: number | null;
    deliveryPrice: number | null;
    deliveryId: number | null;
    pickupId: number | null;
    region_id?: number;
    district?: string;
};

const COLUMNS = [
    {
        Header: 'Федеральный округ / Регион',
        accessor: 'subject',
    },
    {
        Header: 'Caмовывоз',
        accessor: 'pickupPrice',
        getProps: () => ({ type: CELL_TYPES.PRICE }),
    },
    {
        Header: 'Доставка',
        accessor: 'deliveryPrice',
        getProps: () => ({ type: CELL_TYPES.PRICE }),
    },
];

const initialState = { action: ActionType.Close, open: false };

type State = {
    action?: ActionType;
    open?: boolean;
    subject?: string;
    region?: string;
    pickupPrice?: number;
    deliveryPrice?: number;
    deliveryId?: number;
    pickupId?: number;
};

const emptyValue = { label: '', value: '' };

const DeliveryPrices = () => {
    const { query } = useRouter();
    const activeTab = +(query?.tab || 0);
    const [popupState, popupDispatch] = usePopupState<State>(initialState);
    const [selectedDistrict, setSelectedDistrict] = useState<SelectItemProps>(emptyValue);
    const [selectedRegion, setSelectedRegion] = useState<SelectItemProps>(emptyValue);
    const { getTabsProps } = useTabs();

    const { data: apiServices, isLoading, error } = useDeliveryServices();
    const deliveryServices = useMemo(() => apiServices?.data || [], [apiServices?.data]);

    const { data: apiDistricts } = useFederalDistricts();
    const federalDistricts = useMemo(
        () => apiDistricts?.data?.map(item => ({ label: item.name, value: `${item.id}` })) || [],
        [apiDistricts?.data]
    );

    const { data: apiRegions } = useRegions({
        filter: {
            federal_district_id: typeof selectedDistrict.value === 'string' ? +selectedDistrict.value : undefined,
        },
    });

    const regions = useMemo(
        () => apiRegions?.data?.map(item => ({ label: item.name, value: `${item.id}` })) || [],
        [apiRegions?.data]
    );

    const regionsGuids = useMemo(
        () => apiRegions?.data?.map(item => ({ id: item.id, guid: item.guid })) || [],
        [apiRegions?.data]
    );

    const {
        data: apiPrices,
        isLoading: isPricesLoading,
        error: pricesError,
    } = useDeliveryPrices({
        filter: {
            delivery_service: deliveryServices.length > 0 ? deliveryServices[activeTab].id : undefined,
        },
        pagination: { type: 'offset', limit: -1, offset: 0 },
        include: ['federal_district', 'region'],
    });

    /** Данные о доставке и самовывозе лежат в базе отдельно и изменяются похожими методами, но отдельно. Поэтому приходится мапать входные данные таким образом, чтобы соответствовать созданному интерфейсу */
    const deliveryPricesData = useMemo(() => {
        const districts =
            apiPrices?.data
                .filter(item => !item.region_id)
                .sort((a, b) => a.federal_district_id - b.federal_district_id)
                .reduce<District[]>((prev, curr, index, arr) => {
                    const prevElem = arr[index - 1];
                    const deliveryPrice = curr.delivery_method === DeliveryMethods.DELIVERY ? curr.price : null;
                    const pickupPrice = curr.delivery_method === DeliveryMethods.PICKUP ? curr.price : null;
                    const deliveryId = curr.delivery_method === DeliveryMethods.DELIVERY ? curr.id : null;
                    const pickupId = curr.delivery_method === DeliveryMethods.PICKUP ? curr.id : null;

                    if (prevElem?.federal_district_id === curr.federal_district_id) {
                        const lastElem = prev[prev.length - 1];
                        if (pickupPrice) {
                            lastElem.pickupPrice = fromKopecksToRouble(pickupPrice);
                            lastElem.pickupId = pickupId;
                        }
                        if (deliveryPrice) {
                            lastElem.deliveryPrice = fromKopecksToRouble(deliveryPrice);
                            lastElem.deliveryId = deliveryId;
                        }

                        return prev;
                    }
                    return [
                        ...prev,
                        {
                            id: curr.id,
                            subject: curr.federal_district.name,
                            federal_district_id: curr.federal_district_id,
                            pickupPrice: pickupPrice ? fromKopecksToRouble(pickupPrice) : pickupPrice,
                            deliveryPrice: deliveryPrice ? fromKopecksToRouble(deliveryPrice) : deliveryPrice,
                            deliveryId,
                            pickupId,
                        },
                    ];
                }, []) || [];

        const preparedRegions =
            apiPrices?.data
                .filter(item => item.region_id)
                .sort((a, b) => a.region_id - b.region_id)
                .reduce<District[]>((prev, curr, index, arr) => {
                    const prevElem = arr[index - 1];
                    const deliveryPrice = curr.delivery_method === DeliveryMethods.DELIVERY ? curr.price : null;
                    const pickupPrice = curr.delivery_method === DeliveryMethods.PICKUP ? curr.price : null;
                    const deliveryId = curr.delivery_method === DeliveryMethods.DELIVERY ? curr.id : null;
                    const pickupId = curr.delivery_method === DeliveryMethods.PICKUP ? curr.id : null;

                    if (prevElem?.region_id === curr.region_id) {
                        const lastElem = prev[prev.length - 1];
                        if (pickupPrice) {
                            lastElem.pickupPrice = fromKopecksToRouble(pickupPrice);
                            lastElem.pickupId = pickupId;
                        }
                        if (deliveryPrice) {
                            lastElem.deliveryPrice = fromKopecksToRouble(deliveryPrice);
                            lastElem.deliveryId = deliveryId;
                        }

                        return prev;
                    }
                    return [
                        ...prev,
                        {
                            id: curr.id,
                            subject: curr.region?.name,
                            region_id: curr.region_id,
                            district: curr.federal_district.name,
                            federal_district_id: curr.federal_district_id,
                            pickupPrice: pickupPrice ? fromKopecksToRouble(pickupPrice) : pickupPrice,
                            deliveryPrice: deliveryPrice ? fromKopecksToRouble(deliveryPrice) : deliveryPrice,
                            deliveryId,
                            pickupId,
                        },
                    ];
                }, []) || [];

        return apiPrices?.data
            ? preparedRegions.reduce<(District & { subRows?: District[] })[]>(
                  (acc, region) => {
                      const findedDistrict = acc.find(
                          district => !district.region_id && district.federal_district_id === region.federal_district_id
                      );
                      if (findedDistrict) {
                          if (findedDistrict.subRows) {
                              findedDistrict.subRows.push(region);
                          } else {
                              findedDistrict.subRows = [region];
                          }
                      } else {
                          acc.push(region);
                      }
                      return acc;
                  },
                  [...districts]
              )
            : [];
    }, [apiPrices]);

    const createDeliveryPrice = useDeliveryPriceCreate();
    const changeDeliveryPrice = useDeliveryPriceChange();
    const deleteDeliveryPrice = useDeleteDeliveryPrice();

    const close = () => {
        popupDispatch({ type: ActionType.Close });
        createDeliveryPrice.reset();
        changeDeliveryPrice.reset();
        deleteDeliveryPrice.reset();
        setSelectedDistrict(emptyValue);
        setSelectedRegion(emptyValue);
    };

    return (
        <PageWrapper
            h1="Стоимость доставки"
            isLoading={isLoading || isPricesLoading}
            error={error || pricesError ? JSON.stringify(error || pricesError) : undefined}
        >
            <Tabs {...getTabsProps()}>
                <Tabs.List>
                    {deliveryServices.map(item => (
                        <Tabs.Tab key={item.id}>{item.name}</Tabs.Tab>
                    ))}
                </Tabs.List>
                <Block>
                    <Block.Header>
                        <Button theme="primary" onClick={() => popupDispatch({ type: ActionType.Add })}>
                            Добавить стоимость доставки
                        </Button>
                    </Block.Header>
                    <Block.Body>
                        {deliveryServices.map(item => (
                            <Tabs.Panel key={item.id}>
                                {deliveryPricesData.length > 0 ? (
                                    <OldTable
                                        needCheckboxesCol={false}
                                        needSettingsBtn={false}
                                        columns={COLUMNS}
                                        data={deliveryPricesData}
                                        expandable
                                        editRow={row => {
                                            if (row?.region_id) {
                                                setSelectedDistrict({
                                                    label: row?.district,
                                                    value: `${row?.federal_district_id}`,
                                                });
                                                setSelectedRegion({
                                                    label: row?.subject,
                                                    value: `${row?.region_id}`,
                                                });
                                            } else if (row?.subject) {
                                                setSelectedDistrict({
                                                    label: row?.subject,
                                                    value: `${row?.federal_district_id}`,
                                                });
                                                setSelectedRegion(emptyValue);
                                            }

                                            popupDispatch({
                                                type: ActionType.Edit,
                                                payload: {
                                                    subject: row?.subject,
                                                    region: row?.region_id || '',
                                                    pickupPrice: row?.pickupPrice,
                                                    deliveryPrice: row?.deliveryPrice,
                                                    deliveryId: row?.deliveryId,
                                                    pickupId: row?.pickupId,
                                                },
                                            });
                                        }}
                                        deleteRow={row =>
                                            popupDispatch({
                                                type: ActionType.Delete,
                                                payload: {
                                                    subject: row?.subject,
                                                    region: row?.region_id || '',
                                                    deliveryId: row?.deliveryId,
                                                    pickupId: row?.pickupId,
                                                },
                                            })
                                        }
                                    >
                                        <colgroup>
                                            <col width="60%" />
                                            <col width="10%" />
                                            <col width="10%" />
                                            <col width="10%" />
                                            <col width="10%" />
                                        </colgroup>
                                    </OldTable>
                                ) : (
                                    <p>Данные отстутствуют</p>
                                )}
                            </Tabs.Panel>
                        ))}
                    </Block.Body>
                </Block>
            </Tabs>

            <Popup
                isOpen={Boolean(popupState.open && popupState.action !== ActionType.Delete)}
                onRequestClose={close}
                title={`${
                    popupState.action === ActionType.Edit
                        ? `Редактировать стоимость доставки для ${popupState.subject}`
                        : 'Добавить стоимость доставки'
                }`}
                popupCss={{ minWidth: scale(50) }}
            >
                <LoadWrapper
                    isLoading={createDeliveryPrice.isLoading || changeDeliveryPrice.isLoading}
                    error={createDeliveryPrice.error?.message || changeDeliveryPrice.error?.message}
                >
                    <Form
                        enableReinitialize
                        initialValues={{
                            district: popupState.subject,
                            region: popupState.region,
                            deliveryPrice: popupState.deliveryPrice,
                            pickupPrice: popupState.pickupPrice,
                            deliveryId: popupState.deliveryId,
                            pickupId: popupState.pickupId,
                        }}
                        onSubmit={vals => {
                            if (selectedDistrict.value) {
                                const commonParams = {
                                    federal_district_id: +selectedDistrict.value,
                                    region_id: selectedRegion.value ? +selectedRegion.value : null,
                                    region_guid: selectedRegion.value
                                        ? regionsGuids.find(
                                              item =>
                                                  item.id ===
                                                  (typeof selectedRegion.value === 'string' && +selectedRegion.value)
                                          )?.guid
                                        : null,
                                    delivery_service: deliveryServices[activeTab].id,
                                };

                                if (vals.deliveryPrice) {
                                    const deliveryParams = {
                                        ...commonParams,
                                        delivery_method: DeliveryMethods.DELIVERY,
                                        price: fromRoubleToKopecks(vals.deliveryPrice),
                                    };
                                    if (vals.deliveryId) {
                                        changeDeliveryPrice.mutate({
                                            ...deliveryParams,
                                            id: vals.deliveryId,
                                        });
                                    } else {
                                        createDeliveryPrice.mutate(deliveryParams);
                                    }
                                }
                                if (vals.pickupPrice) {
                                    const pickupParams = {
                                        ...commonParams,
                                        delivery_method: DeliveryMethods.PICKUP,
                                        price: fromRoubleToKopecks(vals.pickupPrice),
                                    };
                                    if (vals.pickupId) {
                                        changeDeliveryPrice.mutate({
                                            ...pickupParams,
                                            id: vals.pickupId,
                                        });
                                    } else {
                                        createDeliveryPrice.mutate(pickupParams);
                                    }
                                }
                            }
                            close();
                        }}
                    >
                        <Form.FastField name="district" label="Федеральный округ" css={{ marginBottom: scale(2) }}>
                            <Select
                                selectedItem={selectedDistrict}
                                items={federalDistricts}
                                onChange={val => {
                                    if (val.selectedItem) {
                                        setSelectedDistrict(val.selectedItem);
                                        setSelectedRegion(emptyValue);
                                    }
                                }}
                            />
                        </Form.FastField>

                        <Form.Field name="region" label="Регион" css={{ marginBottom: scale(2) }}>
                            <Select
                                selectedItem={selectedRegion}
                                items={regions}
                                onChange={val => {
                                    if (val.selectedItem) setSelectedRegion(val.selectedItem);
                                }}
                            />
                        </Form.Field>
                        <Form.FastField
                            name="deliveryPrice"
                            label="Доставка"
                            css={{ marginBottom: scale(2) }}
                            type="number"
                        />
                        <Form.FastField
                            name="pickupPrice"
                            label="Caмовывоз"
                            css={{ marginBottom: scale(2) }}
                            type="number"
                        />
                        <div css={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button type="submit" css={{ marginRight: scale(2) }}>
                                Сохранить
                            </Button>
                            <Button theme="secondary" onClick={close}>
                                Отменить
                            </Button>
                        </div>
                    </Form>
                </LoadWrapper>
            </Popup>
            <Popup
                isOpen={Boolean(popupState.open && popupState.action === ActionType.Delete)}
                onRequestClose={close}
                title="Вы уверены, что хотите удалить стоимость доставки для"
                popupCss={{ minWidth: scale(50) }}
            >
                <LoadWrapper isLoading={deleteDeliveryPrice.isLoading} error={deleteDeliveryPrice.error?.message}>
                    <>
                        {popupState.subject ? <p css={{ marginBottom: scale(2) }}>{popupState.subject}</p> : null}
                        <div css={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                type="submit"
                                css={{ marginRight: scale(2) }}
                                onClick={async () => {
                                    await Promise.all([
                                        popupState.deliveryId
                                            ? deleteDeliveryPrice.mutateAsync(popupState.deliveryId)
                                            : null,
                                        popupState.pickupId
                                            ? deleteDeliveryPrice.mutateAsync(popupState.pickupId)
                                            : null,
                                    ]);
                                    close();
                                }}
                            >
                                Удалить
                            </Button>
                            <Button type="submit" theme="secondary" onClick={close}>
                                Отменить
                            </Button>
                        </div>
                    </>
                </LoadWrapper>
            </Popup>
        </PageWrapper>
    );
};

export default DeliveryPrices;

export async function getServerSideProps() {
    return {
        props: {},
    };
}
