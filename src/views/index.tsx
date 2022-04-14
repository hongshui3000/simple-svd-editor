import Block from '@components/Block';
import PageWrapper from '@components/PageWrapper';
import { useLinkCSS } from '@scripts/hooks';
import Link from 'next/link';

export default function Home() {
    const linkStyles = useLinkCSS();

    return (
        <PageWrapper title="Главная страница">
            <Block>
                <Block.Body>
                    Главная <span>страница</span> пока пуста. Воспользуйтесь меню, чтобы перейти на существующие
                    <br />
                    <br />
                    <Link href="/table-example" passHref>
                        <a css={linkStyles}>Пример таблицы</a>
                    </Link>
                    <br />
                    <br />
                    <Link href="/table-example-expandable" passHref>
                        <a css={linkStyles}> Пример разворачивающейся таблицы</a>
                    </Link>
                    <br />
                </Block.Body>
            </Block>
        </PageWrapper>
    );
}
