import { useError } from '@context/modal';
import { useFormikContext } from 'formik';

const FormError = () => {
    const { errors } = useFormikContext();
    // TODO доработать вызов для модалок для формы
    useError({
        message: Object.keys(errors).length > 0 ? 'Форма заполнена некорректно' : '',
        code: '',
        status: 400,
        name: 'Ошибка формы',
    });
    return null;
};
export default FormError;
