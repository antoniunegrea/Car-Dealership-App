import { AxiosProgressEvent } from 'axios';
import { BaseService } from './BaseService';

export interface UploadedFile {
    url: string;
    name: string;
}

export class FileService extends BaseService {

    async getAllFiles(): Promise<UploadedFile[]> {
        const response = await this.axiosInstance.get('/all');
        return response.data;
    }

    async uploadFile(
        file: File,
        onProgress?: (progressEvent: AxiosProgressEvent) => void
    ): Promise<{ fileUrl: string }> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await this.axiosInstance.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: onProgress,
        });

        return response.data;
    }

    getDownloadUrl(filename: string): string {
        return `${this.baseUrl}/download/${filename}`;
    }
} 