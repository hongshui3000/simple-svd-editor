import * as Yup from 'yup';

import Form from '@components/controls/Form';
import Password from '@components/controls/Password';

import { scale, useTheme, Button, typography } from '@scripts/gds';
import { ErrorMessages } from '@scripts/constants';

interface AuthProps {
    logIn: (values: { login: string; password: string }) => void;
}

const Auth = ({ logIn }: AuthProps) => {
    const { shadows, colors } = useTheme();
    return (
        <div
            css={{
                minHeight: '100vh',
                display: 'grid',
                placeItems: 'center',
            }}
        >
            <main
                css={{
                    width: scale(45),
                    boxShadow: shadows?.big,
                    padding: `${scale(3)}px ${scale(4)}px`,
                    backgroundColor: colors?.white,
                }}
            >
                <h1 css={{ ...typography('h1'), textAlign: 'center', marginTop: 0 }}>Авторизация</h1>
                <Form
                    onSubmit={({ login, password }) => logIn({ login, password })}
                    initialValues={{ login: '', password: '' }}
                    validationSchema={Yup.object().shape({
                        login: Yup.string().email(ErrorMessages.EMAIL).required(ErrorMessages.REQUIRED),
                        password: Yup.string().min(6, ErrorMessages.MIN_SYMBOLS(6)).required(ErrorMessages.REQUIRED),
                    })}
                >
                    <Form.FastField name="login" label="E-mail" css={{ marginBottom: scale(2) }} type="email" />
                    <Form.FastField name="password" label="Пароль" css={{ marginBottom: scale(4) }}>
                        <Password />
                    </Form.FastField>
                    <Button type="submit" block>
                        Войти
                    </Button>
                </Form>
            </main>
        </div>
    );
};

export default Auth;
