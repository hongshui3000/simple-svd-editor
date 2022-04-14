import { Message } from './message-types';

export interface ChatsFilter {
    theme: string;
    type_id: number;
    channel_id: number;
    status_id: number;
}

export interface NewChat {
    user_id?: number | string | null,
    theme?: string;
    type_id?: number;
    channel_id?: number;
    status_id?: number;
}

export interface UpdateChat {
    id: number,
    theme: string;
    type_id?: number;
    status_id?: number;
}

export interface Chat {
    id: number;
    last_message_at: Date;
    user_id: number;
    theme: string;
    channel_id: number;
    status_id: number;
    type_id: number;
    messages: Message[];
}
