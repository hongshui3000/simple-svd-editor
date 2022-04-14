import { FC, memo, useEffect } from 'react';

import { ImagePreview } from './constants';

interface DropzoneImageProps {
    file: File;
}

const areEqualFiles = (prevProps: DropzoneImageProps, nextProps: DropzoneImageProps) =>
    prevProps.file.name === nextProps.file.name;

const DropzoneImage: FC<DropzoneImageProps> = memo(({ file }) => {
    const url = URL.createObjectURL(file);
    useEffect(() => () => URL.revokeObjectURL(url), [url]);

    return (
        <div
            css={{
                display: 'grid',
                placeItems: 'center',
                img: { width: ImagePreview.width, height: ImagePreview.height, objectFit: 'cover' },
            }}
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`Превью картинки ${file.name}`} />
        </div>
    );
}, areEqualFiles);

export default DropzoneImage;
