import { useRouter } from 'next/router';
import { useMemo, useEffect, useState } from 'react';
import { FormikValues, useField } from 'formik';
import { differenceInYears } from 'date-fns';

import { useCustomer, useUpdateCustomer, useAddCustomerAvatar, useDeleteCustomerAvatar } from '@api/customers/index';

import FilePond from '@components/controls/FilePond';

import Form from '@components/controls/Form';
import CalendarInput from '@components/controls/CalendarInput';
import Textarea from '@components/controls/Textarea';
import Select from '@components/controls/Select';

import Block from '@components/Block';

import { prepareForSelectFromObject, declOfNum } from '@scripts/helpers';
import { Button, scale } from '@scripts/gds';
import { customerGenderValues } from '@scripts/enums';
import { useListCSS } from '@scripts/hooks';
import { FileTypes } from '@scripts/constants';

const AgeField = () => {
    const [field] = useField('birthday');
    const date = field.value ? new Date(field.value) : null;
    const age = date ? differenceInYears(new Date(), date) : null;
    return <>{age && age > 0 ? `${age} ${declOfNum(age, ['год', 'года', 'лет'])}` : 'Неверная дата рождения'}</>;
};

const FilePondWrapper = ({ url }: { url?: string }) => {
    const [files, setFiles] = useState<Blob[]>([]);
    useEffect(() => {
        const downloadImg = async (fileUrl: string) => {
            try {
                const res = await fetch(fileUrl);
                const file = await res.blob();
                setFiles([file]);
            } catch (e) {
                console.error(e);
            }
        };
        if (url) downloadImg(url);
    }, [url]);

    return <FilePond files={files} onUpdateFiles={setFiles} acceptedFileTypes={FileTypes.IMAGES} />;
};

const Information = () => {
    const genders = useMemo(
        () => [{ value: null, label: 'Не выбрано' }, ...prepareForSelectFromObject(customerGenderValues)],
        []
    );

    const { ddBaseStyles, dlBaseStyles, dtBaseStyles } = useListCSS();

    const { query } = useRouter();
    const id = query.id?.toString() || '';
    const { data, refetch } = useCustomer(id);
    const customer = data?.data;
    const updateCustomer = useUpdateCustomer();
    const updateAvatar = useAddCustomerAvatar();
    const deleteAvatar = useDeleteCustomerAvatar();

    const onCustomerUpdate = async (values: FormikValues) => {
        if (customer) {
            updateCustomer.mutate(
                {
                    ...customer,
                    birthday: values?.birthday?.toString(),
                    gender: +values?.gender,
                    city: values?.city,
                    // comment_internal: values?.comment,
                },
                {
                    onSuccess: () => {
                        refetch();
                    },
                }
            );
            if (values.file.length > 0) {
                updateAvatar.mutate({ id: customer.id, file: values.file[0] });
            } else {
                deleteAvatar.mutate(customer.id);
            }
        }
    };

    return (
        <Form
            initialValues={{
                file: [],
                gender: customer?.gender,
                birthday: customer?.birthday ? new Date(customer.birthday) : null,
                city: customer?.city,
                // comment: customer?.comment_internal,
            }}
            onSubmit={onCustomerUpdate}
        >
            <Block css={{ width: '50%' }}>
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
                        <dt css={dtBaseStyles}>Фото</dt>
                        <dd css={ddBaseStyles}>
                            <Form.Field name="file">
                                <FilePondWrapper url={customer?.avatar} />
                            </Form.Field>
                        </dd>
                        <dt css={dtBaseStyles}>Пол</dt>
                        <dd css={ddBaseStyles}>
                            <Form.Field name="gender">
                                <Select items={genders} />
                            </Form.Field>
                        </dd>
                        <dt css={dtBaseStyles}>Дата рождения</dt>
                        <dd css={ddBaseStyles}>
                            <Form.Field name="birthday">
                                <CalendarInput />
                            </Form.Field>
                        </dd>
                        <dt css={dtBaseStyles}>Возраст</dt>
                        <dd css={ddBaseStyles}>
                            <AgeField />
                        </dd>
                        <dt css={dtBaseStyles}>Город</dt>
                        <dd css={ddBaseStyles}>
                            <Form.Field name="city" />
                        </dd>
                        <dt css={dtBaseStyles}>Служебный комментарий</dt>
                        <dd css={ddBaseStyles}>
                            <Form.Field name="comment">
                                <Textarea rows={3} />
                            </Form.Field>
                        </dd>
                    </dl>
                </Block.Body>
            </Block>
        </Form>
    );
};

export default Information;
