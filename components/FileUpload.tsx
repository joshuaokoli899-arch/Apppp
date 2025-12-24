
import React, { useState, useRef, useCallback } from 'react';
import { UploadIcon, FileZipIcon, CheckCircleIcon } from './icons';

interface FileUploadProps {
    onFileChange: (file: File | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = useCallback((file: File | null) => {
        if (file && file.type === "application/zip") {
            setSelectedFile(file);
            onFileChange(file);
        } else if (file) {
            alert("Please select a valid .zip file.");
            setSelectedFile(null);
            onFileChange(null);
        }
    }, [onFileChange]);
    
    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };

    const onFileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const onButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={onFileChangeHandler}
                accept=".zip"
                className="hidden"
            />
            {!selectedFile ? (
                 <div
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={onButtonClick}
                    className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${isDragging ? 'border-cyan-400 bg-gray-700' : 'border-gray-600 hover:border-cyan-500 bg-gray-900/50'}`}
                >
                    <UploadIcon />
                    <p className="mt-2 text-gray-400">
                        <span className="font-semibold text-cyan-400">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">ZIP file only</p>
                </div>
            ) : (
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                        <FileZipIcon />
                        <span className="font-mono text-green-400">{selectedFile.name}</span>
                    </div>
                     <button 
                        onClick={() => {
                            setSelectedFile(null);
                            onFileChange(null);
                            if(fileInputRef.current) fileInputRef.current.value = "";
                        }} 
                        className="text-gray-400 hover:text-white transition-colors"
                        aria-label="Remove file"
                    >
                        &times;
                    </button>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
