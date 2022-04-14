import Link from 'next/link';
import { FC, useCallback, useState } from 'react';
import Media from 'react-media';
import { CSSObject } from '@emotion/core';

import { scale, useTheme, Button, typography } from '@scripts/gds';
import { FlatMenuItemExtended } from '@scripts/data/menu';

import EnsiLogo from '@icons/ensi.svg';
import LogoutIcon from '@icons/small/logOut.svg';
import UserIcon from '@icons/small/user.svg';
import BellIcon from '@icons/small/bell.svg';
import BurgerIcon from '@icons/small/menu.svg';
// import SearchIcon from '@icons/small/search.svg';

import Tooltip, { ContentBtn } from '@components/controls/Tooltip';
import Popup from '@components/controls/Popup';
import Breadcrumbs from '@components/controls/Breadcrumbs';
import { CurrentUser } from '@api/auth';

// import { Search, SearchProps } from './Search';

export interface HeaderProps {
    /** on logout btn click method */
    onLogout: () => void;
    /** breadcrumb */
    breadcrumb?: FlatMenuItemExtended;
    /** On menu click */
    onMenuClick?: () => void;
    user?: CurrentUser | undefined;
    /** on search callback */
    // onSearch: SearchProps['onSearch'];
}

const btnStyles: CSSObject = {
    padding: `${scale(1)}px !important`,
};

const Header: FC<HeaderProps> = ({ onLogout, breadcrumb, onMenuClick, user }) => {
    const { colors, shadows, layout } = useTheme();
    const [isUserOpen, setIsUserOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    const getUserContent = useCallback(
        () => (
            <>
                {user && (
                    <p css={{ padding: `${scale(1, true)}px ${scale(1)}px` }}>
                        <UserIcon css={{ marginRight: scale(1, true) }} /> {user?.full_name}
                    </p>
                )}
                <ContentBtn Icon={LogoutIcon} onClick={onLogout}>
                    Выйти
                </ContentBtn>
            </>
        ),
        [onLogout, user]
    );

    const getNotificationsContent = useCallback(
        () => <p css={{ padding: `${scale(1, true)}px ${scale(1)}px` }}>Уведомлений пока нет</p>,
        []
    );

    return layout ? (
        <Media query={{ minWidth: layout.breakpoints.md }}>
            {matches => (
                <>
                    <header
                        css={{
                            position: 'relative',
                            zIndex: 2,
                            width: '100%',
                            height: scale(7),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingLeft: scale(3),
                            paddingRight: scale(3),
                            borderBottom: `1px solid ${colors?.grey300}`,
                            backgroundColor: colors?.white,
                            boxShadow: shadows?.big,
                            ...typography('bodySm'),
                        }}
                    >
                        <div css={{ display: 'flex', alignItems: 'center' }}>
                            <Link href="/" passHref>
                                <a css={{ marginRight: scale(1) }}>
                                    <EnsiLogo />
                                </a>
                            </Link>
                            {breadcrumb ? (
                                <Breadcrumbs>
                                    {breadcrumb.parent.map(b => (
                                        <Breadcrumbs.Item link={b.link} key={b.text}>
                                            {b.text}
                                        </Breadcrumbs.Item>
                                    ))}
                                    <Breadcrumbs.Item link={breadcrumb.link}>{breadcrumb.text}</Breadcrumbs.Item>
                                </Breadcrumbs>
                            ) : null}
                        </div>
                        {matches && (
                            <div css={{ display: 'flex' }}>
                                {/* <Search onSearch={onSearch} placeholder="Поиск" /> */}
                                <Tooltip
                                    placement="bottom-end"
                                    theme="light"
                                    content={getUserContent()}
                                    minWidth={scale(25)}
                                    arrow
                                >
                                    <Button type="button" theme="ghost" hidden Icon={UserIcon}>
                                        Пользователь
                                    </Button>
                                </Tooltip>
                                <Tooltip
                                    placement="bottom-end"
                                    theme="light"
                                    content={getNotificationsContent()}
                                    minWidth={scale(25)}
                                    arrow
                                >
                                    <Button type="button" theme="ghost" hidden Icon={BellIcon}>
                                        Уведомления
                                    </Button>
                                </Tooltip>
                            </div>
                        )}
                    </header>
                    {!matches && (
                        <>
                            <div
                                css={{
                                    position: 'fixed',
                                    zIndex: 2,
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    background: colors?.white,
                                    padding: `${scale(1)}px ${scale(3)}px`,
                                    boxShadow: shadows?.small,
                                }}
                            >
                                <Button
                                    type="button"
                                    size="sm"
                                    theme="ghost"
                                    hidden
                                    Icon={BurgerIcon}
                                    css={btnStyles}
                                    onClick={onMenuClick}
                                >
                                    Меню
                                </Button>
                                {/* <Button type="button" size="sm" theme="ghost" hidden Icon={BurgerIcon} css={btnStyles}>
                                    Поиск
                                </Button> */}
                                <Button
                                    type="button"
                                    size="sm"
                                    theme="ghost"
                                    hidden
                                    Icon={UserIcon}
                                    css={btnStyles}
                                    onClick={() => setIsUserOpen(true)}
                                >
                                    Пользоваетль
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    theme="ghost"
                                    hidden
                                    Icon={BellIcon}
                                    css={btnStyles}
                                    onClick={() => setIsNotificationOpen(true)}
                                >
                                    Уведомления
                                </Button>
                            </div>

                            <Popup
                                isOpen={isUserOpen}
                                onRequestClose={() => setIsUserOpen(false)}
                                title="Администратор"
                                isFullscreen
                            >
                                <Popup.Body>{getUserContent()}</Popup.Body>
                            </Popup>
                            <Popup
                                isOpen={isNotificationOpen}
                                onRequestClose={() => setIsNotificationOpen(false)}
                                title="Уведомления"
                                isFullscreen
                            >
                                <Popup.Body>{getNotificationsContent()}</Popup.Body>
                            </Popup>
                        </>
                    )}
                </>
            )}
        </Media>
    ) : null;
};

export default Header;
