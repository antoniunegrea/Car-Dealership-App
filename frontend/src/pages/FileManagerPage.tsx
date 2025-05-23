import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/fileManager.css';

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
                const response = await axios.get('http://localhost:3000/api/files/all');
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
            const response = await axios.post('http://localhost:3000/api/files/upload', formData, {
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

    const isVideoFile = (filename: string) => {
        const videoTypes = /\.(mp4|mov|avi|mkv)$/i;
        return videoTypes.test(filename);
    };

    return (
        <div className="file-manager-container">
            {/* Header Section */}
            <div className="header-section">
                <h2>File Manager</h2>
                <button className="back-button" onClick={() => navigate('/dealerships')}>
                    Go Back Home
                </button>
            </div>

            {/* Upload Section */}
            <div className="upload-section">
                <h3>Upload File</h3>
                <div className="upload-form">
                    <div className="upload-input-group">
                        <input
                            type="file"
                            accept="video/mp4,video/mov,video/avi,video/x-matroska,application/zip,application/x-rar-compressed,.rar"
                            onChange={handleFileChange}
                            className="upload-input"
                        />
                        <button
                            onClick={handleUpload}
                            disabled={!file || uploadProgress > 0}
                            className="upload-button"
                        >
                            {uploadProgress > 0 ? `Uploading (${uploadProgress}%)` : 'Upload'}
                        </button>
                    </div>
                    <p className="supported-types">
                        Supported file types: .mp4, .mov, .avi, .mkv, .zip, .rar
                    </p>
                    {error && (
                        <p className="error-message">
                            {error}
                        </p>
                    )}
                    {uploadProgress > 0 && (
                        <div className="progress-container">
                            <progress value={uploadProgress} max="100" />
                        </div>
                    )}
                </div>
            </div>

            {/* Uploaded Files Section */}
            <div className="files-section">
                <h3>Uploaded Files</h3>
                {uploadedFiles.length === 0 ? (
                    <p className="no-files">No files uploaded yet.</p>
                ) : (
                    <ul className="files-list">
                        {uploadedFiles.map((file, index) => (
                            <li key={index} className="file-item">
                                <span className="file-name">{file.name}</span>
                                <button
                                    onClick={() => handleDownload(file.url, file.name)}
                                    className="download-button"
                                >
                                    Download
                                </button>
                                <div className="file-preview">
                                    {isVideoFile(file.name) ? (
                                        <video controls src={file.url} />
                                    ) : (
                                        <span>(Archive file)</span>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default FileManagerPage;