import { ReactNode } from 'react';
import { Button, scale, useTheme } from '@scripts/gds';
import TrashIcon from '@icons/small/trash.svg';
import EditIcon from '@icons/small/edit.svg';
import CameraIcon from '@icons/small/cameraOff.svg';
import VideoIcon from '@icons/small/noVideo.svg';

export interface ContentBlockProps {
    /** title */
    title?: string;
    /** image src */
    img?: string;
    /** code of youtube video */
    video?: string;
    /** text content */
    text?: string;
    /** block type */
    type?: 'image' | 'video' | 'text' | 'list';
    /** placeholder for empty text for type text */
    textPlaceholder?: string;
    /** class name */
    className?: string;
    /** on edit handler */
    onEdit?: () => void;
    /** on remove handler */
    onRemove?: () => void;
    /** children */
    children?: ReactNode;
}
const ContentBlock = ({
    title,
    text,
    img,
    type,
    textPlaceholder,
    video,
    className,
    onEdit,
    onRemove,
    children,
}: ContentBlockProps) => {
    const { shadows, colors } = useTheme();
    return (
        <div
            css={{ borderRadius: 5, boxShadow: shadows?.small, padding: scale(2), background: colors?.white }}
            className={className}
        >
            <div
                css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: scale(1) }}
            >
                <p css={{ marginRight: scale(2) }}>{title}</p>
                <div>
                    {onRemove ? (
                        <Button Icon={TrashIcon} type="button" theme="ghost" hidden onClick={onRemove}>
                            удалить
                        </Button>
                    ) : null}
                    {onEdit ? (
                        <Button Icon={EditIcon} type="button" theme="ghost" hidden onClick={onEdit}>
                            редактировать
                        </Button>
                    ) : null}
                </div>
            </div>
            {type === 'image' && img && <img src={img} alt="" />}
            {type === 'video' && video && (
                <iframe
                    title={`${title}-frame`}
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${video}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
            )}
            {(type === 'image' && !img) || (type === 'video' && !video) ? (
                <div
                    css={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: colors?.grey100,
                        fill: colors?.grey400,
                        height: scale(20),
                    }}
                >
                    {type === 'image' && <CameraIcon width={scale(4)} height={scale(4)} />}
                    {type === 'video' && <VideoIcon width={scale(4)} height={scale(4)} />}
                </div>
            ) : null}
            {type === 'text' && text}
            {type === 'list' && text && (
                <ol>
                    {text?.split('|').map(i => (
                        <li css={{ listStyle: 'decimal', listStylePosition: 'inside' }} key={i}>
                            {i}
                        </li>
                    ))}
                </ol>
            )}
            {(type === 'text' || type === 'list') && !text && (
                <p css={{ color: colors?.grey800 }}> {textPlaceholder || 'Текст не  задан'}</p>
            )}
            {children}
        </div>
    );
};

export default ContentBlock;
