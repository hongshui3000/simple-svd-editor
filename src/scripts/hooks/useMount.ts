/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, EffectCallback } from 'react';

export const useMount = (effect: EffectCallback) => {
    useEffect(effect, []);
};
