import * as Yup from 'yup';
import { ErrorMessages } from '@scripts/constants';
import { regPhone } from '@scripts/regex';
import { SYSTEMS, FORM_FIELDS } from './types';

const passwordValidationFields = {
        [FORM_FIELDS.PASSWORD]: Yup.string().min(8, ErrorMessages.MIN_SYMBOLS(8)).required(ErrorMessages.REQUIRED),
        [FORM_FIELDS.PASSWORD_CONFIRM]: Yup.string()
        .required(ErrorMessages.REQUIRED)
        .oneOf([Yup.ref(FORM_FIELDS.PASSWORD), ''], ErrorMessages.PASSWORD)
};

export const validationForChangeUser = {
        [SYSTEMS.ADMIN]: {
                [FORM_FIELDS.ACTIVE]: Yup.string().required(ErrorMessages.REQUIRED),
                [FORM_FIELDS.LOGIN]: Yup.string().required(ErrorMessages.REQUIRED),
                [FORM_FIELDS.EMAIL]: Yup.string().email(ErrorMessages.EMAIL).required(ErrorMessages.REQUIRED),
                [FORM_FIELDS.PHONE]: Yup.string().matches(regPhone, ErrorMessages.PHONE).required(ErrorMessages.REQUIRED)
        },
        [SYSTEMS.CUSTOMERS]: {
                [FORM_FIELDS.ACTIVE]: Yup.string().required(ErrorMessages.REQUIRED),
                [FORM_FIELDS.LOGIN]: Yup.string().required(ErrorMessages.REQUIRED),
                [FORM_FIELDS.EMAIL]: Yup.string().email(ErrorMessages.EMAIL).required(ErrorMessages.REQUIRED),
                [FORM_FIELDS.PHONE]: Yup.string().matches(regPhone, ErrorMessages.PHONE).required(ErrorMessages.REQUIRED),
        },
        [SYSTEMS.SELLERS]: {
                [FORM_FIELDS.SELLER_ID]: Yup.string().required(ErrorMessages.REQUIRED),
                [FORM_FIELDS.ACTIVE]: Yup.string().required(ErrorMessages.REQUIRED),
                [FORM_FIELDS.LOGIN]: Yup.string().required(ErrorMessages.REQUIRED),
                [FORM_FIELDS.EMAIL]: Yup.string().email(ErrorMessages.EMAIL).required(ErrorMessages.REQUIRED),
                [FORM_FIELDS.PHONE]: Yup.string().matches(regPhone, ErrorMessages.PHONE).required(ErrorMessages.REQUIRED),
        }
};

export const validationForAddUser = {
        [SYSTEMS.ADMIN]: {
                ...validationForChangeUser[SYSTEMS.ADMIN],
        },
        [SYSTEMS.CUSTOMERS]: {
                ...validationForChangeUser[SYSTEMS.CUSTOMERS],
                ...passwordValidationFields,
        },
        [SYSTEMS.SELLERS]: {
                ...validationForChangeUser[SYSTEMS.SELLERS],
                ...passwordValidationFields,
        }
};
