import { FC, HTMLProps, ReactNode, useMemo } from 'react';
import { SVGRIcon } from '@customTypes/index';

import { scale, typography, colors } from '@scripts/gds';

import EditIcon from '@icons/small/edit.svg';
import ExportIcon from '@icons/small/export.svg';
import CopyIcon from '@icons/small/copy.svg';
import TrashIcon from '@icons/small/trash.svg';

export interface ContentBtnProps extends HTMLProps<HTMLButtonElement> {
    type?: 'edit' | 'copy' | 'export' | 'delete';
    children: ReactNode;
    Icon?: SVGRIcon;
}

export const ContentBtn: FC<ContentBtnProps> = ({ type, children, Icon, ...props }) => {
    const IconComponent = useMemo(() => {
        if (Icon) return Icon;

        switch (type) {
            case 'copy':
                return CopyIcon;
            case 'export':
                return ExportIcon;
            case 'delete':
                return TrashIcon;
            case 'edit':
                return EditIcon;
            default:
                return '';
        }
    }, [type, Icon]);
    return (
        <button
            type="button"
            css={{
                ...typography('bodySm'),
                height: scale(4),
                width: '100%',
                textAlign: 'left',
                padding: `${scale(1, true)}px ${scale(1)}px`,
                svg: { marginRight: scale(1, true), verticalAlign: 'top' },
                ':hover': { background: colors.infoBg },
            }}
            {...props}
        >
            <IconComponent />
            {children}
        </button>
    );
};
