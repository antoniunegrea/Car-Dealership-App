import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface UploadedFile {
    url: string;
    name: string;
}

const FileManagerPage: React.FC = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/files');
                setUploadedFiles(response.data);
            } catch (err) {
                console.error('Error fetching files:', err);
            }
        };
        fetchFiles();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file to upload');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:3000/api/upload', formData, {
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(percentCompleted);
                    }
                },
            });

            const fileUrl = response.data.fileUrl;
            setUploadedFiles((prev) => [...prev, { url: fileUrl, name: file.name }]);
            setUploadProgress(0);
            setFile(null);
            alert('File uploaded successfully!');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error uploading file');
            setUploadProgress(0);
        }
    };

    const handleDownload = (url: string, name: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div style={{ padding: 20 }}>
            <button onClick={() => navigate('/')} style={{ marginBottom: 20 }}>
                Go Back Home
            </button>
            <h2>File Manager</h2>
            <div>
                <h3>Upload Video</h3>
                <input
                    type="file"
                    accept="video/mp4,video/mov,video/avi,video/mkv"
                    onChange={handleFileChange}
                />
                <button onClick={handleUpload} disabled={!file || uploadProgress > 0}>
                    {uploadProgress > 0 ? `Uploading (${uploadProgress}%)` : 'Upload'}
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {uploadProgress > 0 && (
                    <div style={{ marginTop: 10 }}>
                        <progress value={uploadProgress} max="100" />
                    </div>
                )}
            </div>
            <div style={{ marginTop: 20 }}>
                <h3>Uploaded Files</h3>
                {uploadedFiles.length === 0 ? (
                    <p>No files uploaded yet.</p>
                ) : (
                    <ul>
                        {uploadedFiles.map((file, index) => (
                            <li key={index}>
                                <span>{file.name}</span>
                                <button
                                    onClick={() => handleDownload(file.url, file.name)}
                                    style={{ marginLeft: 10 }}
                                >
                                    Download
                                </button>
                                <video
                                    controls
                                    src={file.url}
                                    style={{ width: 200, marginLeft: 10 }}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default FileManagerPage;