import { useFormikContext } from 'formik';

const FormError = () => {
    const { errors } = useFormikContext();
    // TODO доработать вызов для модалок для формы
    console.log(errors);
    return null;
};
export default FormError;
