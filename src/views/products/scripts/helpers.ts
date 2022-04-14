import { Property } from '@api/catalog';
import { nanoid } from 'nanoid';
import * as Yup from 'yup';
import { ErrorMessages } from '@scripts/constants';

import { ATTR_PROPS, ATTR_TYPES } from './types';

export const getEmptyValue = () => ({ value: '', code: '', name: nanoid(6) });
export const generateEmptyValueForAttribute = () => Array.from({ length: 2 }, () =>  getEmptyValue())

export const dataToAttrProps = (data: Property) => {
    const attrsList: ATTR_PROPS[] = [];
    const { is_multiple: isMultiple, is_color: isColor, is_filterable: isFilterable } = data;
    const propsToAttrsMap = new Map([
        [ATTR_PROPS.FEW_VALUES, isMultiple],
        [ATTR_PROPS.COLOR, isColor],
        [ATTR_PROPS.FILTER, isFilterable],
    ]);

    propsToAttrsMap.forEach((attrActive: boolean | undefined, attr: ATTR_PROPS) => {
        if (attrActive) {
            attrsList.push(attr);
        }
    });

    return attrsList;
};

export const getValidationProperties = () => Yup.object().shape({
        productNameForAdmin: Yup.string().required(ErrorMessages.REQUIRED),
        productNameForPublic: Yup.string().required(ErrorMessages.REQUIRED),
        attrType: Yup.string().required(ErrorMessages.REQUIRED),
        additionalAttributes: Yup.array().when('attrType', {
            is: ATTR_TYPES.DIRECTORY,
            then: Yup.array()
                .of(
                    Yup.object().shape({
                        name: Yup.string(),
                        value: Yup.string().required(ErrorMessages.REQUIRED),
                    })
                )
                .min(2, 'Введите минимум 2 атрибута')
                .required(ErrorMessages.REQUIRED),
            otherwise: Yup.array(),
        }),
    })
