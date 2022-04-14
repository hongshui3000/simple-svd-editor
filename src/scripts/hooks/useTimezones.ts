import { prepareForSelect } from '@scripts/helpers';
import timezones from 'countries-and-timezones';
import { useMemo } from 'react';

export const useTimezones = () => useMemo(() => prepareForSelect(Object.keys(timezones.getAllTimezones())), []);
