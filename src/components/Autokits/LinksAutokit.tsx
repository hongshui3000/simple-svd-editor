import { Layout, scale } from '@scripts/gds';
import { useLinkCSS } from '@scripts/hooks';
import CartIcon from '@icons/small/cart.svg';

const LinksAutokit = () => {
    const greyLinkStyles = useLinkCSS('grey');
    const blueLinkStyles = useLinkCSS('blue');
    const blackLinkStyles = useLinkCSS('black');

    return (
        <Layout cols={3} css={{ p: { marginBottom: scale(1) } }}>
            <Layout.Item col={1}>
                <p>Черные</p>
                <br />
                <p>
                    <a css={blackLinkStyles} href="#">
                        Link
                    </a>
                </p>
                <p>
                    <a css={blackLinkStyles} href="#">
                        <CartIcon /> Link
                    </a>
                </p>
                <p>
                    <a css={blackLinkStyles} href="#">
                        Link <CartIcon />
                    </a>
                </p>
                <br />

                <p>
                    <a css={blackLinkStyles} href="#">
                        <span>Link</span>
                    </a>
                </p>
                <p>
                    <a css={blackLinkStyles} href="#">
                        <CartIcon /> <span>Link</span>
                    </a>
                </p>
                <p>
                    <a css={blackLinkStyles} href="#">
                        <span>Link</span> <CartIcon />
                    </a>
                </p>
            </Layout.Item>
            <Layout.Item col={1}>
                <p>Синие (дефолтные)</p>
                <br />
                <p>
                    <a css={blueLinkStyles} href="#">
                        Link
                    </a>
                </p>
                <p>
                    <a css={blueLinkStyles} href="#">
                        <CartIcon /> Link
                    </a>
                </p>
                <p>
                    <a css={blueLinkStyles} href="#">
                        Link <CartIcon />
                    </a>
                </p>

                <br />
                <p>
                    <a css={blueLinkStyles} href="#">
                        <span>Link</span>
                    </a>
                </p>
                <p>
                    <a css={blueLinkStyles} href="#">
                        <CartIcon /> <span>Link</span>
                    </a>
                </p>
                <p>
                    <a css={blueLinkStyles} href="#">
                        <span>Link</span> <CartIcon />
                    </a>
                </p>
            </Layout.Item>
            <Layout.Item col={1}>
                <p>Серые</p>
                <br />
                <p>
                    <a css={greyLinkStyles} href="#">
                        Link
                    </a>
                </p>
                <p>
                    <a css={greyLinkStyles} href="#">
                        <CartIcon /> Link
                    </a>
                </p>
                <p>
                    <a css={greyLinkStyles} href="#">
                        Link <CartIcon />
                    </a>
                </p>

                <br />
                <p>
                    <a css={greyLinkStyles} href="#">
                        <span>Link</span>
                    </a>
                </p>
                <p>
                    <a css={greyLinkStyles} href="#">
                        <CartIcon /> <span>Link</span>
                    </a>
                </p>
                <p>
                    <a css={greyLinkStyles} href="#">
                        <span>Link</span> <CartIcon />
                    </a>
                </p>
            </Layout.Item>
        </Layout>
    );
};

export default LinksAutokit;
