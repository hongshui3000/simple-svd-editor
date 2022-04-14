import { useMemo, useState } from 'react';
import * as Yup from 'yup';
import { scale, Button, Layout, typography } from '@scripts/gds';

import Block from '@components/Block';
import OldTable from '@components/OldTable';
import PageWrapper from '@components/PageWrapper';

import Form from '@components/controls/Form';
import Popup from '@components/controls/Popup';
import Select from '@components/controls/Select';
import Textarea from '@components/controls/Textarea';

import { ActionType } from '@scripts/enums';
import { getRandomItem } from '@scripts/mock';
import { CHANNELS } from '@scripts/data/different';
import { ErrorMessages } from '@scripts/constants';
import { prepareForSelect, Flatten } from '@scripts/helpers';

import { usePopupState } from '@hooks/usePopupState';
import { useSelectedRowsData } from '@hooks/useSelectedRowsData';

import PlusIcon from '@icons/small/plus.svg';
import TrashIcon from '@icons/small/trash.svg';

const columns = [
    {
        Header: 'ID',
        accessor: 'id',
    },
    {
        Header: 'Канал',
        accessor: 'channel',
    },
    {
        Header: 'Текст',
        accessor: 'text',
    },
];

const rawTypes = ['Тип 1', 'Тип 2', 'Тип 3', 'Тип 4', 'Тип 5', 'Тип 6'];

const tableItem = (id: number) => ({
    id,
    channel: getRandomItem(CHANNELS),
    text: getRandomItem([
        'ВЫ УСПЕШНО ПРОШЛИ РЕГИСТРАЦИЮ НА Ensi! {{ $CUSTOMER_NAME }}, благодарим за регистрацию на Ensi! Теперь вы можете: Приобретать товары мировых брендов по выгодным ценам; Получать бонусные бонусы за совершенные покупки; Следить за статусами заказов в личном кабинете(гипер ссылка на ЛК); Быть в курсе проходящих акций.',
        'Вы успешно прошли модерацию! Вам достуны все возможности www.Ensi',
        'Ваша заявка успешно обработана! Вам достуны все возможности Ensi!',
    ]),
});

const makeData = (len: number) => [...Array(len).keys()].map(el => tableItem(el));

const channels = prepareForSelect(CHANNELS);
const types = prepareForSelect(rawTypes);

const initialState = { channel: '', text: '', action: ActionType.Close, open: false };

type State = {
    id?: string;
    channel?: string;
    text?: string;
    action?: ActionType;
    open?: boolean;
};

const CommunicationsNotification = () => {
    const [popupState, popupDispatch] = usePopupState<State>(initialState);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isAddWarningOpen, setIsAddWarningOpen] = useState(false);
    const data = useMemo(() => makeData(3), []);
    const [ids, setIds, selectedRows] = useSelectedRowsData<Flatten<typeof data>>(data);

    return (
        <PageWrapper h1="Настройка уведомлений">
            <>
                <Layout cols={2} css={{ marginBottom: scale(2) }}>
                    <Layout.Item col={1}>
                        <div>
                            <p css={{ ...typography('h2'), marginBottom: scale(2) }}>Шаблоны</p>
                            <Button Icon={PlusIcon} onClick={() => popupDispatch({ type: ActionType.Add })}>
                                Добавить шаблон
                            </Button>
                            {ids.length > 0 ? (
                                <Button
                                    Icon={TrashIcon}
                                    onClick={() => setIsDeleteOpen(true)}
                                    css={{ marginLeft: scale(2) }}
                                >
                                    Удалить шаблон{ids.length === 1 ? '' : 'ы'}
                                </Button>
                            ) : null}
                        </div>
                    </Layout.Item>
                    <Layout.Item col={1}>
                        <p css={{ ...typography('h2'), marginBottom: scale(2) }}>Триггеры</p>
                        <Button Icon={PlusIcon} onClick={() => setIsAddWarningOpen(true)}>
                            Добавить триггер
                        </Button>
                    </Layout.Item>
                </Layout>

                <Block>
                    <Block.Body>
                        <OldTable
                            data={data}
                            columns={columns}
                            onRowSelect={setIds}
                            editRow={row => {
                                popupDispatch({
                                    type: ActionType.Edit,
                                    payload: {
                                        id: row?.id,
                                        channel: row?.channel,
                                        text: row?.text,
                                    },
                                });
                            }}
                        />
                    </Block.Body>
                </Block>
                <Popup
                    isOpen={Boolean(popupState.open)}
                    onRequestClose={() => popupDispatch({ type: ActionType.Close })}
                    title={`${popupState.action === ActionType.Edit ? 'Редактированить' : 'Создать'} шаблон`}
                    popupCss={{ minWidth: scale(50) }}
                >
                    <Form
                        initialValues={{
                            text: popupState.text,
                            channel: popupState.channel,
                        }}
                        onSubmit={vals => console.log(vals)}
                        validationSchema={Yup.object().shape({
                            text: Yup.string().required(ErrorMessages.REQUIRED),
                            channel: Yup.string().required(ErrorMessages.REQUIRED),
                        })}
                    >
                        <Form.FastField name="channel" label="Канал" css={{ marginBottom: scale(2) }}>
                            <Select items={channels} defaultValue={popupState.channel} />
                        </Form.FastField>
                        <Form.FastField name="text" label="Тело" css={{ marginBottom: scale(2) }}>
                            <Textarea />
                        </Form.FastField>
                        <Form.Reset theme="fill" css={{ marginRight: scale(2) }}>
                            {popupState.action === ActionType.Edit ? 'Сбросить' : 'Очистить'}
                        </Form.Reset>
                        <Button type="submit">Сохранить</Button>
                        {/* При желании можно добавить кнопку "удалить" в этот попап. Тогда для подтверждения удаления рекомендую использовать тултип */}
                    </Form>
                </Popup>
                <Popup
                    isOpen={isAddWarningOpen}
                    onRequestClose={() => setIsAddWarningOpen(false)}
                    title="Добавить триггер"
                    popupCss={{ minWidth: scale(50) }}
                >
                    <Form
                        initialValues={{
                            title: '',
                            text: '',
                            link: '',
                            type: '',
                        }}
                        onSubmit={vals => console.log(vals)}
                        validationSchema={Yup.object().shape({
                            title: Yup.string().required(ErrorMessages.REQUIRED),
                            text: Yup.string().required(ErrorMessages.REQUIRED),
                            link: Yup.string().required(ErrorMessages.REQUIRED),
                            type: Yup.string().required(ErrorMessages.REQUIRED),
                        })}
                    >
                        <Form.FastField name="title" label="Название" css={{ marginBottom: scale(2) }} />
                        <Form.FastField name="text" label="Тело" css={{ marginBottom: scale(2) }}>
                            <Textarea />
                        </Form.FastField>
                        <Form.FastField name="link" label="Ссылка" type="link" css={{ marginBottom: scale(2) }} />
                        <Form.Field name="type" label="Тип" css={{ marginBottom: scale(4) }}>
                            <Select items={types} />
                        </Form.Field>
                        <Form.Reset theme="fill" css={{ marginRight: scale(2) }}>
                            Очистить
                        </Form.Reset>
                        <Button type="submit">Сохранить</Button>
                    </Form>
                </Popup>
                <Popup
                    isOpen={isDeleteOpen}
                    onRequestClose={() => setIsDeleteOpen(false)}
                    title="Вы уверены, что хотите удалить следующие уведомления?"
                    popupCss={{ minWidth: scale(50) }}
                >
                    <ul css={{ marginBottom: scale(2) }}>
                        {selectedRows.map(r => (
                            <li key={r.id} css={{ marginBottom: scale(1, true) }}>
                                #{r.id}
                            </li>
                        ))}
                    </ul>
                    <Button>Удалить</Button>
                </Popup>
            </>
        </PageWrapper>
    );
};

export default CommunicationsNotification;
