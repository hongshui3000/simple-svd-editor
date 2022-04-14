import { Layout, useTheme, scale, typography } from '@scripts/gds';
import { format } from 'date-fns';

const data = [
    {
        id: 1,
        date: 'Thu Mar 11 2021 13:13:37 GMT+0300 (Moscow Standard Time)',
        user: 'Администратор',
        action: 'Установил цену оффера в 15 000 руб.',
    },
    {
        id: 2,
        date: 'Thu Mar 01 2021 12:10:02 GMT+0300 (Moscow Standard Time)',
        user: 'Администратор',
        action: 'Сменил сегмент товара на "С"',
    },
    {
        id: 3,
        date: 'Thu Feb 03 2021 15:11:40 GMT+0300 (Moscow Standard Time)',
        user: 'Администратор',
        action: 'Создал товарт"',
    },
];

const History = () => {
    const { colors } = useTheme();

    return (
        <ul>
            <li css={{ borderBottom: `1px solid ${colors?.grey400}` }}>
                <Layout cols={6} css={typography('bodyMdBold')}>
                    <Layout.Item col={1}>Дата</Layout.Item>
                    <Layout.Item col={1}>Пользователь</Layout.Item>
                    <Layout.Item col={1}>Действие</Layout.Item>
                </Layout>
            </li>
            {data.map(i => (
                <li
                    css={{
                        borderBottom: `1px solid ${colors?.grey400}`,
                        paddingTop: scale(1, true),
                        paddingBottom: scale(1, true),
                    }}
                    key={i.id}
                >
                    <Layout cols={6}>
                        <Layout.Item col={1}>{i.date ? format(new Date(i.date), 'dd.MM.yyyy HH:mm') : '-'}</Layout.Item>
                        <Layout.Item col={1}>{i.user}</Layout.Item>
                        <Layout.Item col={1}>{i.action}</Layout.Item>
                    </Layout>
                </li>
            ))}
        </ul>
    );
};

export default History;
