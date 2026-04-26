import React, { useState, useCallback } from 'react';
import { UploadCloud, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const FileUpload = ({ onUploadSuccess }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }, []);

    const validateFile = (file) => {
        if (!file) return "No file selected.";
        if (file.type !== "application/pdf") return "Only PDF files are allowed.";
        if (file.size > 5 * 1024 * 1024) return "File size must be less than 5MB.";
        if (file.size === 0) return "File is empty.";
        return null;
    };

    const processFile = async (selectedFile) => {
        setError(null);
        setSuccess(false);

        const validationError = validateFile(selectedFile);
        if (validationError) {
            setError(validationError);
            return;
        }

        setFile(selectedFile);
        setUploading(true);

        try {
            const { uploadFile } = await import('../services/api');
            await uploadFile(selectedFile);

            setSuccess(true);
            setFile(null);
            if (onUploadSuccess) onUploadSuccess();

            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.message || "Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload-input').click()}
                className={`relative group border-2 border-dashed rounded-xl p-8 transition-all duration-300 ease-out text-center cursor-pointer overflow-hidden
                    ${isDragging ? 'border-amber-400 bg-amber-400/5 scale-[1.02]' : 'border-carbon-700 hover:border-amber-400/50 hover:bg-carbon-800/50'}
                    ${uploading ? 'pointer-events-none opacity-80' : ''}
                    ${success ? 'border-sage-400/60 bg-sage-400/5' : ''}
                    ${error ? 'border-coral-400/60 bg-coral-400/5' : ''}
                `}
            >
                <input
                    id="file-upload-input"
                    type="file"
                    accept="application/pdf"
                    onChange={handleChange}
                    className="hidden"
                    disabled={uploading}
                />

                <div className="flex flex-col items-center justify-center gap-3 relative z-10">
                    {uploading ? (
                        <div className="animate-fade-in">
                            <div className="relative w-16 h-16 mb-3 mx-auto">
                                <div className="absolute inset-0 flex items-center justify-center animate-bounce opacity-20">
                                    <UploadCloud size={48} className="text-amber-400" />
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Loader2 size={30} className="text-amber-400 animate-spin" />
                                </div>
                            </div>
                            <p className="text-sm font-semibold text-amber-400 animate-pulse">Scanning & Uploading...</p>
                        </div>
                    ) : success ? (
                        <div className="animate-fade-in text-sage-400">
                            <CheckCircle size={44} className="mx-auto mb-3" />
                            <p className="font-semibold">Upload Successful!</p>
                            <p className="text-xs text-carbon-400 mt-1">Transactions updated.</p>
                        </div>
                    ) : error ? (
                        <div className="animate-fade-in text-coral-400">
                            <XCircle size={38} className="mx-auto mb-3" />
                            <p className="font-semibold text-sm">{error}</p>
                            <p className="text-xs text-carbon-400 mt-1">Try again or drag a new file.</p>
                        </div>
                    ) : (
                        <>
                            <div className={`p-4 rounded-xl bg-carbon-800 border border-carbon-700/50 group-hover:bg-amber-400/10 group-hover:border-amber-400/20 transition-all duration-300 ${isDragging ? 'bg-amber-400/10 border-amber-400/20' : ''}`}>
                                <UploadCloud size={28} className={`text-carbon-400 group-hover:text-amber-400 transition-colors duration-300 ${isDragging ? 'text-amber-400' : ''}`} />
                            </div>
                            <div className="mt-1">
                                <p className="text-sm font-medium text-carbon-200 group-hover:text-amber-400 transition-colors">
                                    Click to upload or drag & drop
                                </p>
                                <p className="text-xs text-carbon-500 mt-1.5">
                                    PDF Statement (Max 5MB)
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileUpload;