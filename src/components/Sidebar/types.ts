import { SVGRIcon } from '@customTypes/index';

export interface MenuItemProps {
    id?: string;
    text: string;
    link?: string;
    subMenu?: MenuItemProps[];
    Icon?: SVGRIcon;
    code: string;
}
