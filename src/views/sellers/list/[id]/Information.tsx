import { FormikValues } from 'formik';
import { Button, scale } from '@scripts/gds';
import { useListCSS } from '@scripts/hooks/useListCSS';

import Form from '@components/controls/Form';
import Block from '@components/Block';
import Textarea from '@components/controls/Textarea';

import { Seller, useUpdateSellerUser, usePatchSeller } from '@api/units';

const Information = ({ seller, onSave }: { seller: Seller; onSave: () => void }) => {
    const { dlBaseStyles, dtBaseStyles, ddBaseStyles } = useListCSS();

    const initialValues = {
        storage_address: seller.storage_address,
        sale_info: seller.sale_info,
        legal_address: seller.legal_address,
        fact_address: seller.fact_address,
        inn: seller.inn,
        kpp: seller.kpp,
        payment_account: seller.payment_account,
        bank: seller.bank,
        bank_address: seller.bank_address,
        bank_bik: seller.bank_bik,
        correspondent_account: seller.correspondent_account,
        last_name: seller.owner.last_name,
        first_name: seller.owner.first_name,
        middle_name: seller.owner.middle_name,
    };

    const patchSeller = usePatchSeller();

    const patchSellerUser = useUpdateSellerUser();

    const saveSellerHandler = async (values: FormikValues) => {
        const { last_name, first_name, middle_name, ...sellerData } = values;

        try {
            await patchSeller
                .mutateAsync({
                    id: seller.id,
                    body: sellerData,
                })
                .then(res => {
                    patchSellerUser.mutate(
                        {
                            id: res.data.owner.id,
                            body: { last_name, first_name, middle_name },
                        },
                        { onSuccess: () => onSave() }
                    );
                });
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Form
            initialValues={initialValues}
            onSubmit={values => {
                saveSellerHandler(values);
            }}
        >
            <Block>
                <Block.Header>
                    <h2>Основная информация</h2>
                    <div css={{ button: { marginLeft: scale(2) } }}>
                        <Form.Reset theme="secondary" type="button">
                            Сбросить
                        </Form.Reset>
                        <Button type="submit">Сохранить</Button>
                    </div>
                </Block.Header>
                <Block.Body>
                    <dl css={{ ...dlBaseStyles, gridTemplateColumns: '200px 1fr' }}>
                        <dt css={dtBaseStyles}>ID</dt>
                        <dd css={ddBaseStyles}>{seller.id}</dd>
                        <dt css={dtBaseStyles}>Дата регистрации</dt>
                        <dd css={ddBaseStyles}>{seller.created_at}</dd>
                        <dt css={dtBaseStyles}>Адреса складов отгрузки*</dt>
                        <dd css={ddBaseStyles}>
                            <Form.FastField name="storage_address">
                                <Textarea rows={3} />
                            </Form.FastField>
                        </dd>
                        <dt css={dtBaseStyles}>Бренды и товарные категории*</dt>
                        <dd css={ddBaseStyles}>
                            <Form.FastField name="sale_info">
                                <Textarea rows={3} />
                            </Form.FastField>
                        </dd>
                    </dl>
                </Block.Body>
                <Block.Header>
                    <h2>Реквизиты юридического лица</h2>
                </Block.Header>
                <Block.Body>
                    <dl css={{ ...dlBaseStyles, gridTemplateColumns: '200px 1fr' }}>
                        <dt css={dtBaseStyles}>Юридический адрес*</dt>
                        <dd css={ddBaseStyles}>
                            <Form.FastField name="legal_address" />
                        </dd>
                        <dt css={dtBaseStyles}>Фактический адрес*</dt>
                        <dd css={ddBaseStyles}>
                            <Form.FastField name="fact_address" />
                        </dd>
                        <dt css={dtBaseStyles}>ИНН*</dt>
                        <dd css={ddBaseStyles}>
                            <Form.FastField name="inn" />
                        </dd>
                        <dt css={dtBaseStyles}>КПП*</dt>
                        <dd css={ddBaseStyles}>
                            <Form.FastField name="kpp" />
                        </dd>
                    </dl>
                </Block.Body>
                <Block.Header>
                    <h2>ФИО генерального</h2>
                </Block.Header>
                <Block.Body>
                    <dl css={{ ...dlBaseStyles, gridTemplateColumns: '200px 1fr' }}>
                        <dt css={dtBaseStyles}>Фамилия</dt>
                        <dd css={ddBaseStyles}>
                            <Form.FastField name="last_name" />
                        </dd>
                        <dt css={dtBaseStyles}>Имя</dt>
                        <dd css={ddBaseStyles}>
                            <Form.FastField name="first_name" />
                        </dd>
                        <dt css={dtBaseStyles}>Отчество</dt>
                        <dd css={ddBaseStyles}>
                            <Form.FastField name="middle_name" />
                        </dd>
                    </dl>
                </Block.Body>

                <Block.Header>
                    <h2>Банковские реквизиты</h2>
                </Block.Header>
                <Block.Body>
                    <dl css={{ ...dlBaseStyles, gridTemplateColumns: '200px 1fr' }}>
                        <dt css={dtBaseStyles}>Номер банковского счета*</dt>
                        <dd css={ddBaseStyles}>
                            <Form.FastField name="payment_account" />
                        </dd>
                        <dt css={dtBaseStyles}>Банк*</dt>
                        <dd css={ddBaseStyles}>
                            <Form.FastField name="bank" />
                        </dd>
                        <dt css={dtBaseStyles}>Номер корреспондентского счета банка*</dt>
                        <dd css={ddBaseStyles}>
                            <Form.FastField name="correspondent_account" />
                        </dd>
                        <dt css={dtBaseStyles}>Юридический адрес банка*</dt>
                        <dd css={ddBaseStyles}>
                            <Form.FastField name="bank_address" />
                        </dd>
                        <dt css={dtBaseStyles}>БИК банка*</dt>
                        <dd css={ddBaseStyles}>
                            <Form.FastField name="bank_bik" />
                        </dd>
                    </dl>
                </Block.Body>
            </Block>
        </Form>
    );
};

export default Information;
