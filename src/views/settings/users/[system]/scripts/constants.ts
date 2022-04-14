import { CELL_TYPES } from '@scripts/enums';
import { getTimezoneForSelect } from './helpers';
import { FORM_FIELDS, SYSTEMS } from './types';

export const COLUMNS = [
    {
        Header: '№',
        accessor: 'id',
        getProps: () => ({ type: CELL_TYPES.LINKED_ID }),
    },
    {
        Header: 'Email',
        accessor: 'email',
        getProps: () => ({ type: CELL_TYPES.LINKED_EMAIL }),
    },
    {
        Header: 'Login',
        accessor: 'login',
    },
];

export const tabs = [
    { label: SYSTEMS.ADMIN, value: 'Административные пользователи' },
    { label: SYSTEMS.SELLERS, value: 'Сотрудники продавцов' },
    { label: SYSTEMS.CUSTOMERS, value: 'Покупатели' },
];

export const emptyInitialFiltersValues = {
    [SYSTEMS.ADMIN]: {
        [FORM_FIELDS.ID]: '',
        [FORM_FIELDS.EMAIL]: '',
        [FORM_FIELDS.PHONE]: '',
        [FORM_FIELDS.LOGIN]: '',
        [FORM_FIELDS.ACTIVE]: null,
        [FORM_FIELDS.ROLE]: '',
    },
    [SYSTEMS.CUSTOMERS]: {
        [FORM_FIELDS.ID]: '',
        [FORM_FIELDS.LOGIN]: '',
        [FORM_FIELDS.PHONE]: '',
        [FORM_FIELDS.EMAIL]: '',
        [FORM_FIELDS.ACTIVE]: null,
    },
    [SYSTEMS.SELLERS]: {
        [FORM_FIELDS.ID]: '',
        [FORM_FIELDS.FULL_NAME]: '',
        [FORM_FIELDS.EMAIL]: '',
        [FORM_FIELDS.PHONE]: '',
        [FORM_FIELDS.LOGIN]: '',
        [FORM_FIELDS.ACTIVE]: null,
        [FORM_FIELDS.ROLE]: '',
    },
};

export const emptyInitialChangeUserValues = {
    [SYSTEMS.ADMIN]: {
        [FORM_FIELDS.ACTIVE]: true,
        [FORM_FIELDS.TIMEZONE]: getTimezoneForSelect().value,
        [FORM_FIELDS.LOGIN]: '',
        [FORM_FIELDS.LAST_NAME]: '',
        [FORM_FIELDS.FIRST_NAME]: '',
        [FORM_FIELDS.MIDDLE_NAME]: '',
        [FORM_FIELDS.EMAIL]: '',
        [FORM_FIELDS.PHONE]: '',
    },
    [SYSTEMS.CUSTOMERS]: {
        [FORM_FIELDS.ACTIVE]: true,
        [FORM_FIELDS.TIMEZONE]: getTimezoneForSelect().value,
        [FORM_FIELDS.LOGIN]: '',
        [FORM_FIELDS.LAST_NAME]: '',
        [FORM_FIELDS.FIRST_NAME]: '',
        [FORM_FIELDS.MIDDLE_NAME]: '',
        [FORM_FIELDS.EMAIL]: '',
        [FORM_FIELDS.PHONE]: '',
    },
    [SYSTEMS.SELLERS]: {
        [FORM_FIELDS.ACTIVE]: true,
        [FORM_FIELDS.TIMEZONE]: getTimezoneForSelect().value,
        [FORM_FIELDS.SELLER_ID]: '',
        [FORM_FIELDS.LOGIN]: '',
        [FORM_FIELDS.LAST_NAME]: '',
        [FORM_FIELDS.FIRST_NAME]: '',
        [FORM_FIELDS.MIDDLE_NAME]: '',
        [FORM_FIELDS.EMAIL]: '',
        [FORM_FIELDS.PHONE]: '',
    },
};

export const emptyInitialAddUserValues = {
    [SYSTEMS.ADMIN]: {
        ...emptyInitialChangeUserValues[SYSTEMS.ADMIN],
        [FORM_FIELDS.PASSWORD]: '',
        [FORM_FIELDS.PASSWORD_CONFIRM]: '',
    },
    [SYSTEMS.CUSTOMERS]: {
        ...emptyInitialChangeUserValues[SYSTEMS.CUSTOMERS],
        [FORM_FIELDS.PASSWORD]: '',
        [FORM_FIELDS.PASSWORD_CONFIRM]: '',
    },
    [SYSTEMS.SELLERS]: {
        ...emptyInitialChangeUserValues[SYSTEMS.SELLERS],
        [FORM_FIELDS.PASSWORD]: '',
        [FORM_FIELDS.PASSWORD_CONFIRM]: '',
    },
};

export const userPageFields = {
    [SYSTEMS.ADMIN]: [
        FORM_FIELDS.ID,
        FORM_FIELDS.FULL_NAME,
        FORM_FIELDS.SHORT_NAME,
        FORM_FIELDS.CREATED_AT,
        FORM_FIELDS.UPDATED_AT,
        FORM_FIELDS.ACTIVE,
        FORM_FIELDS.LOGIN,
        FORM_FIELDS.LAST_NAME,
        FORM_FIELDS.FIRST_NAME,
        FORM_FIELDS.MIDDLE_NAME,
        FORM_FIELDS.EMAIL,
        FORM_FIELDS.PHONE,
        FORM_FIELDS.TIMEZONE,
    ],

    [SYSTEMS.CUSTOMERS]: [
        FORM_FIELDS.ID,
        FORM_FIELDS.FULL_NAME,
        FORM_FIELDS.SHORT_NAME,
        FORM_FIELDS.CREATED_AT,
        FORM_FIELDS.UPDATED_AT,
        FORM_FIELDS.ACTIVE,
        FORM_FIELDS.LOGIN,
        FORM_FIELDS.LAST_NAME,
        FORM_FIELDS.FIRST_NAME,
        FORM_FIELDS.MIDDLE_NAME,
        FORM_FIELDS.EMAIL,
        FORM_FIELDS.PHONE,
    ],

    [SYSTEMS.SELLERS]: [
        FORM_FIELDS.ID,
        FORM_FIELDS.FULL_NAME,
        FORM_FIELDS.SHORT_NAME,
        FORM_FIELDS.CREATED_AT,
        FORM_FIELDS.UPDATED_AT,
        FORM_FIELDS.SELLER_ID,
        FORM_FIELDS.ACTIVE,
        FORM_FIELDS.LOGIN,
        FORM_FIELDS.LAST_NAME,
        FORM_FIELDS.FIRST_NAME,
        FORM_FIELDS.MIDDLE_NAME,
        FORM_FIELDS.EMAIL,
        FORM_FIELDS.PHONE,
        FORM_FIELDS.TIMEZONE,
    ],
};
