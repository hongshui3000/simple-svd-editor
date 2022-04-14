export interface MessagesFilter {
    user_id: number;
    chat_id: number;
    'chat.theme_like': string;
    'chat.type': number;
    channel_id: number;
    'chat.unread_admin': boolean;
}

export interface Message {
    id: number;
    created_at: string;
    user_id: number;
    chat_id: number;
    text: string;
    files: string[];
}

export interface NewMessage {
    user_id: number | string | null;
    chat_id: number;
    text: string;
    files: string[];
}
