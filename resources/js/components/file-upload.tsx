import { cn } from '@/lib/utils';
import { Upload } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

interface FileUploadProps {
    label: string;
    accept: string;
    maxSize: string;
    onChange?: (file: File) => void;
}

export function FileUpload({ label, accept, maxSize, onChange }: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            const file = e.dataTransfer.files[0];
            if (file) {
                setSelectedFile(file);
                onChange?.(file);
            }
        },
        [onChange],
    );

    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                setSelectedFile(file);
                onChange?.(file);
            }
        },
        [onChange],
    );

    const handleClick = () => {
        inputRef.current?.click();
    };

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-[#0F172A]">{label}</label>
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
                className={cn(
                    'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors',
                    isDragging
                        ? 'border-[#1E3A8A] bg-[#1E3A8A]/5'
                        : selectedFile
                          ? 'border-[#10B981] bg-[#10B981]/5'
                          : 'border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#1E3A8A]/30 hover:bg-[#1E3A8A]/5',
                )}
            >
                <input ref={inputRef} type="file" accept={accept} onChange={handleFileChange} className="hidden" />
                {selectedFile ? (
                    <>
                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#10B981]/10">
                            <Upload className="h-5 w-5 text-[#10B981]" />
                        </div>
                        <p className="text-sm font-medium text-[#0F172A]">{selectedFile.name}</p>
                        <p className="mt-0.5 text-xs text-[#64748B]">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        <p className="mt-1 text-xs text-[#10B981]">Klik untuk mengganti file</p>
                    </>
                ) : (
                    <>
                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#1E3A8A]/10">
                            <Upload className="h-5 w-5 text-[#1E3A8A]" />
                        </div>
                        <p className="text-sm font-medium text-[#0F172A]">Seret file ke sini atau klik untuk unggah</p>
                        <p className="mt-1 text-xs text-[#64748B]">
                            Maksimal {maxSize} — Format yang didukung: {accept}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
