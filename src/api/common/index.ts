import { apiClient } from '..';

const download = (path: string, filename: string) => {
    const anchor = document.createElement('a');
    anchor.href = path;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
};

/**
 * @param data - Информация о файле в виде объекта. Для потребителя неважно какие внутри ключи
 * @param filename - Название файла
 */
export const downloadFile = (data: any, filename: string) =>
    apiClient.downloadFile('common/files/download-protected', { data }).then(blob => {
        const url = URL.createObjectURL(blob);
        download(url, filename);
        URL.revokeObjectURL(url);
    });
