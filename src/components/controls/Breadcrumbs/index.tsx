import { useTheme, typography } from '@scripts/gds';
import { FC, HTMLProps, ReactNode, Children, cloneElement, isValidElement } from 'react';
import BreadcrumbsItem, { BreadcrumbsItemProps } from './Item';
import Separator from './Separator';

export interface BreadcrumbsCompositionProps {
    Item: FC<BreadcrumbsItemProps>;
}

export interface BreadcrumbsProps extends HTMLProps<HTMLDivElement> {
    /** List of Breadcrumbs.Item components */
    children: ReactNode;
}

export const Breadcrumbs: FC<BreadcrumbsProps> & BreadcrumbsCompositionProps = ({ children, ...props }) => {
    const { colors } = useTheme();
    return (
        <nav
            aria-label="Вы находитесь здесь:"
            {...props}
            css={{ display: 'flex', color: colors?.grey800, ...typography('bodySm') }}
        >
            <Separator />
            <ol css={{ display: 'flex' }}>
                {Children.map(children, (child, index) => {
                    if (isValidElement(child)) {
                        return cloneElement(child, {
                            ...child?.props,
                            index,
                        });
                    }
                })}
            </ol>
            <Separator />
        </nav>
    );
};

Breadcrumbs.Item = BreadcrumbsItem;

export default Breadcrumbs;
