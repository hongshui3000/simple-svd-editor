import {
    useContext,
    createContext,
    ReactNode,
    ReactNodeArray,
    Dispatch,
    SetStateAction,
    useState,
    useEffect,
    useCallback,
} from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { nanoid } from 'nanoid';
import Modal, { ModalProps } from '@components/controls/Modal';
import { Button, scale, useTheme } from '@scripts/gds';
import { FetchError } from '@api/index';

type ExtendedModal = ModalProps & { id: string | number; initedTime: number };
export interface ModalContextProps {
    modals: ExtendedModal[];
    setModals: Dispatch<SetStateAction<ExtendedModal[]>>;
    appendModal: (modal: ModalProps) => void;
}

const ModalContext = createContext<ModalContextProps | null>(null);
ModalContext.displayName = 'ModalContext';

const ANIMATION_TIME = 300;
const DELAY = 5000;

export const ModalProvider = ({ children }: { children: ReactNode | ReactNodeArray }) => {
    const { colors } = useTheme();
    const [modals, setModals] = useState<ExtendedModal[]>([]);

    const handleEnter = (...args: [HTMLElement, boolean]) => {
        const [instance] = args;
        instance.style.animation = `fadeInRight ${ANIMATION_TIME}ms ease-in`;
    };

    const handleExit = (...args: [HTMLElement]) => {
        const [instance] = args;
        instance.style.animation = `fadeOutRight ${ANIMATION_TIME}ms ease`;
    };

    const appendModal = useCallback((newModal: ModalProps) => {
        const defaultProps = { icon: true, closeBtn: true };
        setModals(items => [...items, { ...defaultProps, id: nanoid(4), initedTime: Date.now(), ...newModal }]);
    }, []);

    const removeModal = (id: number | string) => {
        setModals(items => items.filter(i => i.id !== id));
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (modals.length) {
                setModals(items => items.slice(1));
            }
        }, DELAY);

        modals.forEach(m => {
            if (m.initedTime + DELAY < Date.now()) {
                removeModal(m.id);
            }
        });

        return () => clearTimeout(timer);
    }, [modals]);

    return (
        <ModalContext.Provider value={{ modals, setModals, appendModal }}>
            <>
                <div
                    css={{
                        position: 'fixed',
                        top: scale(1),
                        right: scale(1),
                        width: scale(30),
                        zIndex: 100,
                        '@keyframes fadeInRight': {
                            '0%': { opacity: 0, transform: 'translate3d(110%, 0, 0)' },
                            '100%': { opacity: 1, transform: 'translate3d(0, 0, 0)' },
                        },
                        '@keyframes fadeOutRight': {
                            '0%': { opacity: 1, transform: 'translate3d(0, 0, 0)' },
                            '100%': { transform: 'translate3d(110%, 0, 0)' },
                        },
                    }}
                >
                    <TransitionGroup component="ul">
                        {modals.map(({ id, ...props }) => (
                            <CSSTransition
                                key={id}
                                timeout={{ enter: ANIMATION_TIME, exit: ANIMATION_TIME }}
                                onEnter={handleEnter}
                                onExit={handleExit}
                            >
                                <li css={{ marginBottom: scale(1) }}>
                                    <Modal
                                        onClose={() => removeModal(id)}
                                        {...props}
                                        css={{ marginBottom: scale(2) }}
                                    />
                                </li>
                            </CSSTransition>
                        ))}
                    </TransitionGroup>
                    <CSSTransition
                        in={modals.length > 1}
                        timeout={{ enter: ANIMATION_TIME, exit: ANIMATION_TIME }}
                        onEnter={handleEnter}
                        onExit={handleExit}
                        unmountOnExit
                    >
                        <Button
                            onClick={() => setModals([])}
                            block
                            css={{ backgroundColor: colors?.secondaryHover, color: colors?.white }}
                        >
                            Закрыть все
                        </Button>
                    </CSSTransition>
                </div>
                {children}
            </>
        </ModalContext.Provider>
    );
};

export const useModalsContext = () => {
    const context = useContext(ModalContext);

    if (!context) {
        throw new Error(`Hook useModal must be used within ModalProvider`);
    }

    return context;
};

export const useError = (err?: FetchError | null) => {
    const { appendModal } = useModalsContext();

    useEffect(() => {
        if (err?.message || err?.code) appendModal({ title: err.code, message: err.message, theme: 'error' });
    }, [err?.message, appendModal, err?.code]);
};

export const useSuccess = (message: string) => {
    const { appendModal } = useModalsContext();

    useEffect(() => {
        if (message) appendModal({ message, theme: 'success' });
    }, [appendModal, message]);
};
