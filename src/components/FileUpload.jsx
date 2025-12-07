import React, { useState, useCallback } from 'react';
import { UploadCloud, FileText, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const FileUpload = ({ onUploadSuccess }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Placeholder for API import to avoid circular dependency issues right now, 
    // but in real app we import logic or pass it as prop.
    // Assuming parent passes the uploader or we import it.
    // For now, importing dynamically or assuming standard import.
    // Let's rely on standard import in the final file setup, but here we write the component.

    // We will assume the API function is imported.
    // Since I cannot modify this file after creating without another tool call, 
    // I'll assume the import is added at the top in the next step or 
    // I can put it here if I include the import line.

    // ... wait, I am writing the whole file. So I should add the import.

    // BUT, I need to make sure I import the named export correctly.
    // import { uploadFile } from '../services/api';

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
            // Import dynamically to ensure it works if the file is just created
            const { uploadFile } = await import('../services/api');
            await uploadFile(selectedFile);

            setSuccess(true);
            setFile(null); // Clear file after success
            if (onUploadSuccess) onUploadSuccess();

            // Auto hide success message after 3 seconds
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
        <div className="w-full max-w-md mx-auto mb-6">
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload-input').click()}
                className={`relative group border-2 border-dashed rounded-xl p-6 transition-all duration-300 ease-in-out text-center cursor-pointer overflow-hidden
                    ${isDragging ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'}
                    ${uploading ? 'pointer-events-none opacity-80' : ''}
                    ${success ? 'border-emerald-500 bg-emerald-50' : ''}
                    ${error ? 'border-rose-400 bg-rose-50' : ''}
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
                        <div className="animate-in fade-in zoom-in duration-300">
                            {/* Easter Egg: Floating Paper Plane Animation */}
                            <div className="relative w-16 h-16 mb-2">
                                <div className="absolute inset-0 flex items-center justify-center animate-bounce">
                                    <UploadCloud size={48} className="text-indigo-600 opacity-20" />
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    {/* Simple rotate animation for loader */}
                                    <Loader2 size={32} className="text-indigo-600 animate-spin" />
                                </div>
                                {/* Flying particle effect css class would go here, keeping simple for now */}
                            </div>
                            <p className="text-sm font-semibold text-indigo-700 animate-pulse">Scanning & Uploading...</p>
                        </div>
                    ) : success ? (
                        <div className="animate-in fade-in zoom-in duration-300 text-emerald-600">
                            <CheckCircle size={48} className="mx-auto mb-2" />
                            <p className="font-semibold">Upload Successful!</p>
                            <p className="text-xs opacity-75">Transactions updated.</p>
                        </div>
                    ) : error ? (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300 text-rose-600">
                            <XCircle size={40} className="mx-auto mb-2" />
                            <p className="font-semibold text-sm">{error}</p>
                            <p className="text-xs mt-1">Try again or drag a new file.</p>
                        </div>
                    ) : (
                        <>
                            <div className={`p-4 rounded-full bg-slate-100 group-hover:bg-indigo-100 transition-colors duration-300 ${isDragging ? 'bg-indigo-200' : ''}`}>
                                <UploadCloud size={32} className={`text-slate-400 group-hover:text-indigo-600 transition-colors duration-300 ${isDragging ? 'text-indigo-700' : ''}`} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-700 group-hover:text-indigo-700 transition-colors">
                                    Click to upload or drag & drop
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
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
