import { FC, forwardRef } from 'react';
import { Draggable } from 'react-beautiful-dnd';

import { useTheme, typography, scale } from '@scripts/gds';
import CloseIcon from '@icons/small/closedCircle.svg';
import { useLinkCSS } from '@scripts/hooks';

import DropzoneImage from './DropzoneImage';
import { getFileSize } from './utils';
import { ImagePreview } from './constants';

export interface FileType extends File {
    id?: number;
    // there is really any type. It doesn't matter  what in here
    file?: any;
}
export interface DropzoneFileProps {
    file: FileType;
    /** Remove item handler */
    onRemoveClick: (index: number, file: FileType) => void;
    /** Index in array */
    index: number;
    /** imagePreview flag */
    imagePreview: boolean;
    /** Errors array */
    errors?: { code: string; message: string }[];
    /** Disable drag flag */
    disabled?: boolean;
    /** onFileClick callback */
    onFileClick?: (file: FileType) => void;
}

export const DropzoneFile = forwardRef<HTMLLIElement, DropzoneFileProps>(
    ({ file, imagePreview, errors, onRemoveClick, disabled, index, onFileClick, ...props }, ref) => {
        const { colors } = useTheme();
        const isImage = file?.type?.includes('image');
        const showPreview = isImage && imagePreview;
        const linkStyles = useLinkCSS();

        const isLink = Boolean(file.id && onFileClick);

        return (
            <li
                {...props}
                className={showPreview ? 'dropzone-image' : undefined}
                css={{
                    display: 'inline-block',
                    verticalAlign: 'top',
                    width: '100%',
                    overflow: 'hidden',
                    backgroundColor: colors?.white,
                    ...(!showPreview && {
                        padding: `${scale(3, true)}px 0`,
                        borderBottom: `1px solid ${colors?.grey200}`,
                    }),
                    ...(showPreview && {
                        border: `1px solid ${errors ? colors?.danger : colors?.grey400}`,
                        width: ImagePreview.width,
                        borderRadius: 2,
                        '& + .dropzone-image': { marginLeft: scale(2) },
                    }),
                }}
                ref={ref}
            >
                {showPreview && <DropzoneImage file={file} />}
                <div
                    css={{
                        display: 'flex',
                        alignItems: 'center',
                        position: 'relative',
                        paddingRight: scale(9, true),
                        ...(showPreview && {
                            paddingTop: scale(1, true),
                            paddingLeft: scale(1),
                            paddingBottom: scale(1, true),
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                        }),
                    }}
                >
                    <div css={{ flexGrow: 1, flexShrink: 1 }}>
                        <button
                            type="button"
                            css={{
                                marginRight: showPreview ? scale(1) : 0,
                                width: showPreview ? ImagePreview.width - scale(6) : 'auto',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                ...typography(showPreview ? 'small' : 'bodySm'),
                                ...(isLink && linkStyles),
                                textAlign: 'left',
                                ':disabled': {
                                    color: 'inherit',
                                    cursor: 'default',
                                },
                            }}
                            onClick={() => {
                                if (onFileClick) onFileClick(file);
                            }}
                            disabled={!isLink}
                        >
                            {file.name}
                        </button>
                    </div>
                    <span css={{ color: colors?.grey800, flexShrink: 0 }}>{getFileSize(file.size)}</span>
                    <button
                        type="button"
                        css={{
                            position: 'absolute',
                            right: 0,
                            top: showPreview ? 0 : -scale(1, true),
                            width: scale(4),
                            height: scale(3),
                            display: 'grid',
                            placeItems: 'center',
                            ':hover': { opacity: 0.8 },
                            ...(disabled && { cursor: 'not-allowed' }),
                        }}
                        onClick={() => onRemoveClick(index, file)}
                        disabled={disabled}
                        title="Удалить файл"
                    >
                        <CloseIcon />
                    </button>
                </div>
                {errors?.map(e => (
                    <p
                        css={{
                            color: colors?.danger,
                            padding: showPreview ? `0 ${scale(1)}px` : 0,
                            ...typography('small'),
                        }}
                        key={e.code}
                    >
                        {e.message}
                    </p>
                ))}
            </li>
        );
    }
);

export const DraggableDropzoneFile: FC<DropzoneFileProps & { isDragDisabled?: boolean }> = ({
    file,
    index,
    isDragDisabled,
    ...props
}) => (
    <Draggable draggableId={file.name} index={index} isDragDisabled={isDragDisabled}>
        {provided => (
            <DropzoneFile
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                {...props}
                file={file}
                index={index}
            />
        )}
    </Draggable>
);
