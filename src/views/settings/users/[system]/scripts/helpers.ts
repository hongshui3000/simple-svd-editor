import timezones from 'countries-and-timezones';
import { FormikValues } from 'formik';
import { isObject, prepareTelValue } from '@scripts/helpers';
import { ApiResponseData, FIELD_TYPES, FormValue, FORM_FIELDS } from './types';

export const getRemoveBtnName = (len: number) => (len > 1 ? 'Удалить пользователей' : 'Удалить пользователя');
export const getTimezoneForSelect = () => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return { value: timezone, label: timezone };
};
export const infoForFieldMap = new Map([
    [
        FORM_FIELDS.ID,
        {
            label: 'ID пользователя',
            type: FIELD_TYPES.NUM,
        },
    ],
    [
        FORM_FIELDS.LOGIN,
        {
            label: 'Логин',
        },
    ],
    [
        FORM_FIELDS.ACTIVE,
        {
            label: 'Активен',
            type: FIELD_TYPES.BOOL,
        },
    ],
    [
        FORM_FIELDS.STATUS,
        {
            label: 'Активен',
            type: FIELD_TYPES.BOOL,
        },
    ],
    [
        FORM_FIELDS.EMAIL,
        {
            label: 'Email',
            type: FIELD_TYPES.EMAIL,
        },
    ],
    [
        FORM_FIELDS.FULL_NAME,
        {
            label: 'ФИО пользователя',
        },
    ],
    [
        FORM_FIELDS.FIRST_NAME,
        {
            label: 'Имя',
        },
    ],
    [
        FORM_FIELDS.LAST_NAME,
        {
            label: 'Фамилия',
        },
    ],
    [
        FORM_FIELDS.MIDDLE_NAME,
        {
            label: 'Отчество',
        },
    ],
    [
        FORM_FIELDS.SELLER_ID,
        {
            label: 'ID продавца',
        },
    ],
    [
        FORM_FIELDS.PASSWORD,
        {
            label: 'Пароль',
            type: FIELD_TYPES.PASSWORD,
        },
    ],
    [
        FORM_FIELDS.PASSWORD_CONFIRM,
        {
            label: 'Повтор пароля',
            type: FIELD_TYPES.PASSWORD,
        },
    ],
    [
        FORM_FIELDS.PHONE,
        {
            label: 'Телефон',
            type: FIELD_TYPES.PHONE,
        },
    ],
    [
        FORM_FIELDS.TIMEZONE,
        {
            label: 'Временная зона',
            type: FIELD_TYPES.SELECT,
            options: Object.keys(timezones.getAllTimezones()).map(name => ({ label: name, value: name })),
        },
    ],
    [
        FORM_FIELDS.CREATED_AT,
        {
            label: 'Дата регистрации',
            type: FIELD_TYPES.DATE,
        },
    ],
    [
        FORM_FIELDS.UPDATED_AT,
        {
            label: 'Дата обновления',
            type: FIELD_TYPES.DATE,
        },
    ],
    [
        FORM_FIELDS.SHORT_NAME,
        {
            label: 'Сокращенное ФИО',
        },
    ],
    [
        FORM_FIELDS.ROLE,
        {
            label: 'Роль',
            type: FIELD_TYPES.SELECT,
            options: [],
        },
    ],
]);

export const formValuesToApiFormat = (values: FormikValues) => {
    const getNewValue = (value: { value: string }, key: string) => {
        if (key === FORM_FIELDS.PHONE) return value.toString().replace(/[() -]/g, '');
        if (isObject(value)) return value.value;

        return value;
    };

    const apiValues: FormikValues = {};
    Object.keys(values).forEach(key => {
        const value = values[key];
        apiValues[key] = getNewValue(value, key);
    });

    return apiValues;
};

export const getInitialValues = (inititalEmptyValues: FormikValues, data: ApiResponseData | null) => {
    const initialValues = { ...inititalEmptyValues };
    if (data) {
        Object.keys(inititalEmptyValues).forEach(key => {
            const infoForField = infoForFieldMap.get(key as FORM_FIELDS);
            const { type = FIELD_TYPES.TEXT, options = [] } = infoForField || {};
            let initialValue: FormValue = data[key as keyof ApiResponseData];

            if (initialValue) {
                if (type === FIELD_TYPES.SELECT && initialValue) {
                    initialValue = options.find(({ value }) => value === initialValue?.toString())?.value;
                } else if (type === FIELD_TYPES.PHONE) {
                    initialValue = prepareTelValue(initialValue.toString());
                }
            }

            initialValues[key] = initialValue;
        });
    }

    return initialValues;
};
