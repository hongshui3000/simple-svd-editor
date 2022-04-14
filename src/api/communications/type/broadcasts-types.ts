export interface CommunicationsBroadcastsRequest {
    user_ids?: number[];
    theme?: string;
    type_id?: number;
    status_id?: number;
    message?: string;
    files?: string[];
}

export interface CommunicationsBroadcastsProp {
    data: CommunicationsBroadcastsRequest;
}
