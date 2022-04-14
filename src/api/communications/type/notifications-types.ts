export interface NotificationsFilter {
    filter?: object;
}
export interface NewNotification {
    name: string;
    type: number;
    theme: string;
    sender: string;
    channel: number;
}
export interface Notification extends NewNotification {
    id: number;
}
