import Block from '@components/Block';
import PageWrapper from '@components/PageWrapper';
import Link from 'next/link';

export default function Home() {
    return (
        <PageWrapper title="Главная страница">
            <Block>
                <Block.Body>
                    <Link href="/controller">Перейди к контроллеру </Link>
                </Block.Body>
            </Block>
        </PageWrapper>
    );
}
