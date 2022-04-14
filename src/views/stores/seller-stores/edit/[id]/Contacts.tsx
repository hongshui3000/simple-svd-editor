import { CSSObject } from '@emotion/core';
import { nanoid } from 'nanoid';
import { FieldArray, useFormikContext } from 'formik';

import Form from '@components/controls/Form';
import Mask from '@components/controls/Mask';
import { typography, scale, Button, VisuallyHidden } from '@scripts/gds';

import Block from '@components/Block';

import { maskPhone } from '@scripts/mask';

import TrashIcon from '@icons/small/trash.svg';
import PlusIcon from '@icons/small/plus.svg';

import { StoreContact } from '@api/units/types';

const columnsContact = [
    {
        Header: 'Контактное лицо',
        accessor: 'contact',
    },
    {
        Header: 'Телефон',
        accessor: 'phone',
    },
    {
        Header: 'Email',
        accessor: 'email',
    },
];

const Contacts = ({ lineCSS }: { lineCSS: CSSObject }) => {
    const {
        values: { contacts },
    } = useFormikContext<{ contacts?: (StoreContact & { pseudo_id?: string })[] }>();

    const getEmptyContact = () => ({
        pseudo_id: nanoid(4),
        contact: '',
        phone: '',
        email: '',
    });

    return (
        <>
            <FieldArray
                name="contacts"
                render={({ push, remove }) => (
                    <>
                        <Block css={{ maxWidth: scale(128) }}>
                            <Block.Body>
                                <VisuallyHidden>
                                    <h2>Контактные лица</h2>
                                </VisuallyHidden>
                                <table width="100%" css={{ borderCollapse: 'collapse' }}>
                                    <tbody>
                                        <tr>
                                            {columnsContact.map(item => (
                                                <th
                                                    css={{ ...typography('bodySmBold'), ...lineCSS, textAlign: 'left' }}
                                                    key={item.accessor}
                                                >
                                                    {item.Header}
                                                </th>
                                            ))}
                                            <th css={lineCSS} />
                                        </tr>
                                        {contacts?.map((c, index: number) => (
                                            <tr key={contacts[index].id || contacts[index].pseudo_id}>
                                                <td css={lineCSS}>
                                                    <Form.FastField name={`contacts[${index}].name`} label=" " />
                                                </td>
                                                <td css={lineCSS}>
                                                    <Form.FastField name={`contacts[${index}].phone`} label=" ">
                                                        <Mask mask={maskPhone} />
                                                    </Form.FastField>
                                                </td>
                                                <td css={lineCSS}>
                                                    <Form.FastField name={`contacts[${index}].email`} label=" " />
                                                </td>
                                                <td css={lineCSS}>
                                                    <Button
                                                        theme="ghost"
                                                        onClick={() => remove(index)}
                                                        Icon={TrashIcon}
                                                        hidden
                                                    >
                                                        Удалить
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div css={{ display: 'flex', justifyContent: 'center', marginTop: scale(2) }}>
                                    <Button
                                        Icon={PlusIcon}
                                        theme="outline"
                                        type="button"
                                        onClick={() => push(getEmptyContact())}
                                    >
                                        Добавить
                                    </Button>
                                </div>
                            </Block.Body>
                        </Block>
                    </>
                )}
            />
        </>
    );
};

export default Contacts;
