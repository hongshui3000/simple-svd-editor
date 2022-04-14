import { DropzoneProps } from 'react-dropzone';
import { DELIMITER } from './constants';
/**
 * Check if accept is not provided or one of accepted types is not image,
 * do not allow image preview mode
 */
export const canPreviewImages = (accept: DropzoneProps['accept']) => {
    if (!accept || (Array.isArray(accept) && accept.length === 0)) return false;
    const types = Array.isArray(accept) ? accept : accept.split(',');
    return !types.some((t: string) => !t.match(/image|png|jpe?g/gi));
};

export const removeItemFromArray = <T extends unknown>(arr: T[], removedIndex: number) => {
    const newArray = arr.slice();
    newArray.splice(removedIndex, 1);
    return newArray;
};

export const getFileSize = (size: number) => {
    if (typeof size !== 'number') return '';
    const KB = size / DELIMITER;
    if (KB > DELIMITER) {
        return `${Math.ceil(KB / DELIMITER)} MB`;
    }
    return `${Math.ceil(KB)} KB`;
};

export const makeMatrixArray = <T extends unknown>(array: T[], itemsInRow: number) => {
    let index = 0;
    const matrixArray: T[][] = [];

    while (index < array.length) {
        matrixArray.push(array.slice(index, index + itemsInRow));
        index += itemsInRow;
    }

    return matrixArray;
};

export const downloadFile = async (fileURL: string, fileName?: string) => {
    if (!fileURL || !fileURL.length) return;

    try {
        const res = await fetch(fileURL);
        const blob = await res.blob();

        return new File([blob], fileName || res.url, {
            lastModified: Date.now(),
            type: blob?.type,
        });
    } catch (e) {
        console.error(e);
    }
};
