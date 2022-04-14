import { MouseEvent, MouseEventHandler, ReactNode } from 'react';
import { Button, ButtonProps } from '@scripts/gds';
import { useFormikContext } from 'formik';

export type FormResetProps<T> = ButtonProps & {
    children: ReactNode;
    /** simple onClick handler */
    onClick?: MouseEventHandler<HTMLButtonElement>;
    /** initial values to reset formik statu to */
    initialValues?: T;
};

export const FormReset = <T extends any>({ children, onClick, initialValues, ...props }: FormResetProps<T>) => {
    const { resetForm } = useFormikContext();

    return (
        <Button
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
                if (onClick) onClick(e);
                resetForm({ values: initialValues });
            }}
            {...props}
        >
            {children}
        </Button>
    );
};

export default FormReset;
