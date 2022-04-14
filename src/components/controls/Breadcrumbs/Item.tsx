import { ReactNode, HTMLProps } from 'react';
import Link from 'next/link';
import Separator from './Separator';

export interface BreadcrumbsItemProps extends HTMLProps<HTMLLIElement> {
    /** Breadcrumbs item content */
    children: ReactNode;
    /** Link address */
    link?: string;
    /** index item */
    index?: number;
}

export const BreadcrumbsItem = ({ link, children, index }: BreadcrumbsItemProps) => (
    <li>
        {index && children ? <Separator /> : null}
        {link ? (
            <Link href={link} passHref>
                <a>{children}</a>
            </Link>
        ) : (
            <span>{children}</span>
        )}
    </li>
);

export default BreadcrumbsItem;
