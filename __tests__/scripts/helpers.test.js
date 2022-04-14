import { isDateString } from '@scripts/helpers';

describe('isDateString helper function works right', () => {
    test('returns false when pass number', () => {
        expect(isDateString('123')).toBe(false);
    });

    test('returns false when pass not date string', () => {
        expect(isDateString('hello')).toBe(false);
    });

    test('returns false when pass null', () => {
        expect(isDateString(null)).toBe(false);
    });

    test('returns false when pass undefined', () => {
        expect(isDateString(undefined)).toBe(false);
    });

    test('returns false when pass true boolean', () => {
        expect(isDateString(true)).toBe(false);
    });

    test('returns true when pass short date string', () => {
        expect(isDateString('2021-08-29')).toBe(true);
    });

    test('returns true when pass real date', () => {
        expect(isDateString('2021-08-29T19:40:17.958Z')).toBe(true);
    });
});
