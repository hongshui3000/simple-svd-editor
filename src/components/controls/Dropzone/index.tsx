import { useCallback, useState, FC, useMemo } from 'react';
import { useDropzone, DropzoneProps as UseDropzoneProps, FileRejection } from 'react-dropzone';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { FieldInputProps, FieldMetaProps, FieldHelperProps } from 'formik';

import { useTheme, typography, scale } from '@scripts/gds';

import { DropzoneFile, DraggableDropzoneFile, DropzoneFileProps, FileType } from './DropzoneFile';
import DropzoneArea from './DropzoneArea';
import { ErrorCodes, ImagePreview } from './constants';
import { canPreviewImages, removeItemFromArray, getFileSize, makeMatrixArray } from './utils';

type DropzoneProps = UseDropzoneProps & {
    /** Formik props */
    field?: FieldInputProps<FileType[]>;
    helpers?: FieldHelperProps<FileType[]>;
    meta?: FieldMetaProps<FileType[]>;
    /** On files change callback */
    onFilesChange?: (files: FileType[]) => void;
    /** On file remove callback. You may need it for remove already uploaded file from Database */
    onFileRemove?: DropzoneFileProps['onRemoveClick'];
    /** On file click callback. You may need it for downloading file */
    onFileClick?: DropzoneFileProps['onFileClick'];
    /** Disable dragging */
    isDragDisabled?: boolean;
    /** Button-like view */
    simple?: boolean;
};

const Dropzone: FC<DropzoneProps> = ({
    accept,
    maxFiles,
    maxSize,
    field,
    helpers,
    onFilesChange,
    onFileRemove: onFileRemoveFromProps,
    isDragDisabled,
    disabled,
    simple,
    onFileClick,
    ...props
}) => {
    const { components } = useTheme();
    const IT = components?.Input;
    const imagePreview = canPreviewImages(accept);

    /** checks is our Dropzone controlled by Formik or not  */
    const isControlled = typeof field?.value !== 'undefined';
    const [filesState, setFilesState] = useState<File[]>([]);
    const files = useMemo(
        () => (isControlled ? field?.value || [] : filesState),
        [field?.value, filesState, isControlled]
    );

    const setFiles = useCallback(
        (newFiles: FileType[]) => {
            if (isControlled) {
                helpers?.setValue(newFiles);
            } else {
                setFilesState(newFiles);
            }
            if (onFilesChange) onFilesChange(newFiles);
        },
        [helpers, isControlled, onFilesChange]
    );

    const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([]);

    const fileValidator = (file: FileType) => {
        if (maxSize && file.size > maxSize)
            return { code: ErrorCodes.TOO_BIG_FILE, message: `Максимальный размер файла ${getFileSize(maxSize)}` };
        return null;
    };

    const filterRepeatedFiles = useCallback(
        (newFiles: FileType[]) => newFiles.filter(f => !files.find(af => af.name === f.name)),
        [files]
    );

    const onDropAccepted = useCallback(
        (acceptedFiles: FileType[]) => {
            setFiles([...files, ...filterRepeatedFiles(acceptedFiles)]);
        },
        [files, filterRepeatedFiles, setFiles]
    );

    const onDropRejected = useCallback((rejectedFiles: FileRejection[]) => {
        setRejectedFiles(rejectedFiles);
    }, []);

    const onFileRemove = useCallback(
        (removedFileIndex: number, removedFile: FileType) => {
            setFiles(removeItemFromArray<FileType>(files, removedFileIndex));
            if (onFileRemoveFromProps) onFileRemoveFromProps(removedFileIndex, removedFile);
        },
        [files, onFileRemoveFromProps, setFiles]
    );

    const onRejectedFileRemove = useCallback(
        (removedFileIndex: number) => {
            const newRejectedFiles = removeItemFromArray<FileRejection>(rejectedFiles, removedFileIndex);

            /** If add too much files and delete one, so validation will be passed, move valid files to state */
            if (maxFiles && newRejectedFiles.length <= maxFiles) {
                const accepted = newRejectedFiles
                    .filter(f => f.errors.find(e => e.code === ErrorCodes.TOO_MANY_FILES))
                    .map(f => f.file);
                const rejected = newRejectedFiles.filter(f => f.errors.find(e => e.code !== ErrorCodes.TOO_MANY_FILES));
                setFiles([...files, ...accepted]);
                setRejectedFiles(rejected);
            } else {
                setRejectedFiles(newRejectedFiles);
            }
        },
        [rejectedFiles, maxFiles, setFiles, files]
    );

    const { getRootProps, getInputProps, rootRef } = useDropzone({
        onDropAccepted,
        onDropRejected,
        accept,
        maxFiles,
        validator: fileValidator,
        disabled,
        ...props,
    });

    const containerWidth = imagePreview ? rootRef.current?.offsetWidth || 0 : 0;
    const itemsInRow = imagePreview ? Math.floor(containerWidth / (ImagePreview.width + scale(2))) : 1;
    const filesMatrix = imagePreview ? makeMatrixArray<FileType>(files, itemsInRow) : [files];

    /** react beautiful dnd callbacks */
    const reorderItems = useCallback(
        (startIndex: number, endIndex: number) => {
            const newFiles = files.slice();
            const [movedItem] = newFiles.splice(startIndex, 1);
            newFiles.splice(endIndex, 0, movedItem);
            setFiles(newFiles);
        },
        [files, setFiles]
    );

    const onDragEnd = useCallback(
        ({ source, destination }: DropResult) => {
            if (!destination || (destination.index === source.index && destination.droppableId === source.droppableId))
                return;
            reorderItems(
                source.index + +source.droppableId * itemsInRow,
                destination.index + +destination.droppableId * itemsInRow
            );
        },
        [reorderItems, itemsInRow]
    );

    return (
        <div css={typography(IT?.typography)}>
            <DropzoneArea {...getRootProps()} inputFieldProps={getInputProps()} disabled={disabled} simple={simple} />
            <div css={imagePreview && { display: 'flex', flexWrap: 'wrap' }}>
                <DragDropContext onDragEnd={onDragEnd}>
                    {filesMatrix.map((filesArr, idx) => (
                        <Droppable
                            droppableId={`${idx}`}
                            direction={imagePreview ? 'horizontal' : 'vertical'}
                            isCombineEnabled={imagePreview}
                            key={idx}
                        >
                            {provided => (
                                <ul
                                    css={{
                                        marginTop: scale(1),
                                        ...(imagePreview && {
                                            marginRight: scale(2),
                                            overflow: 'hidden',
                                            width: '100%',
                                        }),
                                    }}
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    {filesArr.map((file, index) => (
                                        <DraggableDropzoneFile
                                            key={`${file.name + file.lastModified}`}
                                            file={file}
                                            index={index}
                                            onRemoveClick={onFileRemove}
                                            imagePreview={imagePreview}
                                            isDragDisabled={disabled || isDragDisabled}
                                            disabled={disabled}
                                            onFileClick={onFileClick}
                                        />
                                    ))}
                                    {imagePreview ? null : provided.placeholder}
                                </ul>
                            )}
                        </Droppable>
                    ))}
                </DragDropContext>
                <ul css={{ marginTop: scale(1) }}>
                    {rejectedFiles.map((rejections, index) => (
                        <DropzoneFile
                            key={rejections.file.name}
                            file={rejections.file}
                            index={index}
                            onRemoveClick={onRejectedFileRemove}
                            imagePreview={imagePreview}
                            errors={rejections.errors}
                            onFileClick={onFileClick}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Dropzone;
