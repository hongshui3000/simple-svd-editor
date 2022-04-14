import { forwardRef, HTMLAttributes } from 'react';
import { useTheme, scale, Button } from '@scripts/gds';
import ImportIcon from '@icons/small/import.svg';

interface DropzoneAreaProps extends HTMLAttributes<HTMLDivElement> {
    inputFieldProps: HTMLAttributes<HTMLInputElement>;
    disabled?: boolean;
    /** Button-like view */
    simple?: boolean;
}

const DropzoneArea = forwardRef<HTMLDivElement, DropzoneAreaProps>(
    ({ disabled, inputFieldProps, simple, ...props }, ref) => {
        const { colors, components } = useTheme();
        const IT = components?.Input;

        return simple ? (
            <div {...props} ref={ref}>
                <input {...inputFieldProps} disabled={disabled} />
                <Button Icon={ImportIcon} type="button" disabled={disabled} theme="secondary">
                    Загрузить
                </Button>
            </div>
        ) : (
            <div
                {...props}
                css={{
                    display: 'grid',
                    placeItems: 'center',
                    border: `1px dashed ${IT?.borderColor}`,
                    borderRadius: IT?.borderRadius,
                    background: IT?.bg,
                    padding: scale(2),
                    textAlign: 'center',
                    transition: 'background 200ms ease-out',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    ...(!disabled && {
                        ':hover': { background: colors?.infoBg },
                    }),
                }}
                ref={ref}
            >
                <input {...inputFieldProps} disabled={disabled} />
                <ImportIcon width={scale(4)} height={scale(4)} css={{ marginBottom: scale(1) }} />
                <p>
                    Нажмите для загрузки файла <br />
                    или перетащите его в&nbsp;эту область
                </p>
            </div>
        );
    }
);

export default DropzoneArea;
