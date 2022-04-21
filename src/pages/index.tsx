import { getXML } from '@api/xml/api';
import getTotalPageData, {
    TotalPageDataProps,
    SVD_PATH,
} from '@scripts/getTotalPageData';
import { QueryClient, dehydrate } from 'react-query';

export { default } from '@views/index';

export async function getServerSideProps(data: TotalPageDataProps) {
    const queryClient = new QueryClient();

    const { xmlData, ...totalData } = await getTotalPageData({
        ...data,
        queryClient,
    });

    const { fetch: fetchXML, key: keyXML } = getXML({ path: SVD_PATH });

    await Promise.all([queryClient.prefetchQuery(keyXML, fetchXML)]);

    return {
        props: {
            ...totalData,
            xmlData,
            dehydratedState: dehydrate(queryClient),
        },
    };
}
