import { FC, MouseEvent } from 'react';

import { Button, scale, useTheme } from '@scripts/gds';
import { useLinkCSS } from '@scripts/hooks';

import ArrowLeft from '@icons/small/chevronLeft.svg';
import ArrowRight from '@icons/small/chevronRight.svg';

import { SelectorView } from '../../typings';

export type HeaderProps = {
    /**
     * Выбранный месяц
     */
    month?: string;

    /**
     * Выбранный год
     */
    year?: string;

    /**
     * Вид шапки — месяц и год или только месяц
     */
    view?: SelectorView;

    /**
     * Отображать тень? (нужна при прокрутке)
     */
    withShadow?: boolean;

    /**
     * Показывать кнопку переключения на пред. месяц?
     */
    prevArrowVisible?: boolean;

    /**
     * Показывать кнопку переключения на след. месяц?
     */
    nextArrowVisible?: boolean;

    /**
     * Обработчик нажатия кнопки переключения на пред. месяц
     */
    onPrevArrowClick?: (event: MouseEvent<HTMLButtonElement>) => void;

    /**
     * Обработчик нажатия кнопки переключения на след. месяц
     */
    onNextArrowClick?: (event: MouseEvent<HTMLButtonElement>) => void;

    /**
     * Обработчик нажатия на кнопку месяца
     */
    onMonthClick?: (event: MouseEvent<HTMLButtonElement>) => void;

    /**
     * Обработчик нажатия на кнопку года
     */
    onYearClick?: (event: MouseEvent<HTMLButtonElement>) => void;
};

export const Header: FC<HeaderProps> = ({
    month,
    year,
    view = 'full',
    prevArrowVisible = true,
    nextArrowVisible = true,
    onPrevArrowClick,
    onNextArrowClick,
    onMonthClick,
    onYearClick,
}) => {
    const { components } = useTheme();
    const calendarTheme = components?.Calendar;

    const linkStyles = useLinkCSS(calendarTheme?.monthAndYearSelectionLinkType);

    return (
        <div aria-live="polite">
            <div css={{ display: 'grid', gridTemplate: '"1fr 1fr 1fr"', alignItems: 'center', height: scale(4) }}>
                <div>
                    {prevArrowVisible && (
                        <Button
                            theme="secondary"
                            onClick={onPrevArrowClick}
                            aria-label="Предыдущий месяц"
                            Icon={ArrowLeft}
                            hidden
                            css={{ border: 'none !important' }}
                        >
                            Предыдущий месяц
                        </Button>
                    )}
                </div>

                {view === 'full' ? (
                    <div css={{ display: 'flex', justifyContent: 'center' }}>
                        <button onClick={onMonthClick} type="button" css={{ ...linkStyles, marginRight: scale(1) }}>
                            {month}
                        </button>

                        <button onClick={onYearClick} type="button" css={linkStyles}>
                            {year}
                        </button>
                    </div>
                ) : (
                    <span css={linkStyles}>{month}</span>
                )}

                <div css={{ justifySelf: 'end' }}>
                    {nextArrowVisible && (
                        <Button
                            theme="secondary"
                            onClick={onNextArrowClick}
                            aria-label="Следующий месяц"
                            Icon={ArrowRight}
                            hidden
                            css={{ border: 'none !important' }}
                        >
                            Следующий месяц
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
