import { useRouter } from 'next/router';

export const useActivePage = () => {
    const { query } = useRouter();
    return +(query.page || 1);
};
