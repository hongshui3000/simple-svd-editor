import { useRouter } from 'next/router';
import { scale } from '@scripts/gds';

import { TableRowProps } from '@components/OldTable';
import Block from '@components/Block';
import PageWrapper from '@components/PageWrapper';

import Tabs from '@components/controls/Tabs';

import { ActionType } from '@scripts/enums';
import { usePopupState, useFiltersHelper } from '@scripts/hooks';
import { User } from '@api/customers/types';
import { CommonResponse } from '@api/common/types';
import { AdminUser, SellerUser } from '@api/units';

import AdminContainer from './Admin';
import CustomersContainer from './Customers';
import SellersContainer from './Sellers';

import { SYSTEMS, State, tabs, emptyInitialFiltersValues } from './scripts';

const initialState = { action: ActionType.Close, open: false };

const Users = () => {
    const { push, pathname, query } = useRouter();
    const activeTab = query?.system ? (query.system.toString() as SYSTEMS) : SYSTEMS.ADMIN;
    const [removePopup, removePopupDispatch] = usePopupState<State>(initialState);

    const { initialValues: filterValues, URLHelper } = useFiltersHelper(emptyInitialFiltersValues[activeTab]);

    const deleteRowHandler = (columnsData: (AdminUser | SellerUser | User)[], row?: TableRowProps) => {
        if (row) {
            const editableRowsFromData = columnsData.filter(dataRow => dataRow.id === +row.id);
            const popupParams = { type: ActionType.Edit, payload: { tableData: editableRowsFromData } };

            removePopupDispatch(popupParams);
        }
    };

    const onSubmitRemove = async (removeUser: (id: number) => Promise<CommonResponse<null>>) => {
        if (removePopup.tableData?.length) {
            const removePromises: Promise<CommonResponse<null>>[] = [];
            removePopup.tableData.forEach(row => {
                removePromises.push(removeUser(row.id));
            });

            await Promise.all(removePromises);
        }

        removePopupDispatch({ type: ActionType.Close });
    };

    const resetFilters = () => push({ pathname, query: { system: activeTab } });

    return (
        <PageWrapper h1="Список пользователей">
            <main>
                <Tabs selectedIndex={tabs.findIndex(tab => tab.label === activeTab)} className="variant-group-tabs">
                    <Block css={{ marginBottom: scale(2) }}>
                        <Block.Body>
                            <Tabs.List>
                                {tabs.map(tab => (
                                    <Tabs.Tab key={tab.label} onClick={() => push({ query: { system: tab.label } })}>
                                        {tab.value}
                                    </Tabs.Tab>
                                ))}
                            </Tabs.List>
                        </Block.Body>
                    </Block>
                    <Tabs.Panel>
                        <AdminContainer
                            filterValues={filterValues}
                            onSubmitFilters={URLHelper}
                            onResetFilters={resetFilters}
                            deleteRowHandler={deleteRowHandler}
                            removePopup={removePopup}
                            removePopupDispatch={removePopupDispatch}
                            onSubmitRemove={onSubmitRemove}
                        />
                    </Tabs.Panel>
                    <Tabs.Panel>
                        <CustomersContainer
                            filterValues={filterValues}
                            onSubmitFilters={URLHelper}
                            onResetFilters={resetFilters}
                            deleteRowHandler={deleteRowHandler}
                            removePopup={removePopup}
                            removePopupDispatch={removePopupDispatch}
                            onSubmitRemove={onSubmitRemove}
                        />
                    </Tabs.Panel>
                    <Tabs.Panel>
                        <SellersContainer
                            filterValues={filterValues}
                            onSubmitFilters={URLHelper}
                            onResetFilters={resetFilters}
                            deleteRowHandler={deleteRowHandler}
                            removePopup={removePopup}
                            removePopupDispatch={removePopupDispatch}
                            onSubmitRemove={onSubmitRemove}
                        />
                    </Tabs.Panel>
                </Tabs>
            </main>
        </PageWrapper>
    );
};

export default Users;

export async function getServerSideProps() {
    return {
        props: {},
    };
}
