import { getXML } from '@api/xml/api';
import { NextApiRequest, NextApiResponse } from 'next';
import { QueryClient } from 'react-query';
import { parseXML, SVDRootObject } from './xml';

export interface CommonComponentDataProps {
    xmlData: SVDRootObject | null;
}

export interface TotalPageDataProps {
    req: NextApiRequest;
    res: NextApiResponse;
    locale: string;
    queryClient: QueryClient;
}

export const SVD_PATH =
    'https://raw.githubusercontent.com/ARM-software/CMSIS/master/CMSIS/SVD/ARM_Example.svd';

const getTotalPageData = async ({ queryClient }: TotalPageDataProps) => {
    const { key: keyXml, fetch: fetchXML } = getXML({ path: SVD_PATH });

    await Promise.all([queryClient.prefetchQuery(keyXml, fetchXML)]);

    const xmlData = queryClient.getQueryData<string>(keyXml);

    const commonData: CommonComponentDataProps = {
        xmlData: xmlData ? parseXML(xmlData) : null,
    };

    return {
        ...commonData,
    };
};

export default getTotalPageData;
