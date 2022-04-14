import { scale } from '@scripts/gds';

export const ErrorCodes = {
    TOO_MANY_FILES: 'too-many-files',
    TOO_BIG_FILE: 'too-big-file',
};

export const ImagePreview = {
    width: scale(23),
    height: scale(20),
    gap: scale(2),
};

export const DELIMITER = 1024;
