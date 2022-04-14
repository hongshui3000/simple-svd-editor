import { useMutation } from 'react-query';
import { apiClient, FetchError } from '../index';
import { CommunicationsBroadcastsRequest, CommunicationsBroadcastsProp } from './type';

export const useCommunicationsBroadcasts = () =>
    useMutation<CommunicationsBroadcastsProp, FetchError, CommunicationsBroadcastsRequest>(broadcast =>
        apiClient.post('communication/broadcasts', { data: broadcast })
    );
