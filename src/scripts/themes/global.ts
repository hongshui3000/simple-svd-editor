import { Theme } from '@greensight/gds';
import tokens from '../../../public/tokens.json';

const { colors } = tokens;

export const global: Theme['global'] = {
    base: {
        focus: {
            width: 2,
            color: colors.warning,
            offset: 2,
        },
        body: {
            typography: 'bodySm',
        },
        css: {
            'input[type="number"]': {
                appearance: 'auto',
            },
            'input[type="number"]::-webkit-outer-spin-button, input[type="number"]::-webkit-inner-spin-button': {
                margin: 0,
                appearance: 'auto',
            },
            hr: { borderColor: colors.grey400, borderWidth: '1px 0 0 0', borderStyle: 'solid' },
        },
    },
};
