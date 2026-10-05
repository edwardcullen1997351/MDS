import React, { forwardRef, useRef, useState, useId } from 'react';
import { Button } from '../Button/index.js';
import { Badge } from '../Badge/index.js';
import { Icon } from '../Icon/index.js';
import './FileUpload.css';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  progress?: number;
  status?: 'uploading' | 'complete' | 'error';
  errorMessage?: string;
  file?: File;
}

export interface FileUploadProps {
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  disabled?: boolean;
  label?: string;
  hint?: string;
  files?: UploadedFile[];
  onFilesChange?: (files: UploadedFile[]) => void;
  className?: string;
}

export const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      accept,
      maxSizeMB = 10,
      multiple = true,
      disabled = false,
      label = 'Click to upload or drag & drop',
      hint = `PDF, PNG, JPG, or CSV up to ${maxSizeMB}MB`,
      files: controlledFiles,
      onFilesChange,
      className = '',
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [internalFiles, setInternalFiles] = useState<UploadedFile[]>([]);
    const inputId = useId();

    const isControlled = controlledFiles !== undefined;
    const currentFiles = isControlled ? controlledFiles : internalFiles;

    const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
    };

    const handleFiles = (incomingFileList: FileList | null) => {
      if (!incomingFileList || disabled) return;

      const newFiles: UploadedFile[] = Array.from(incomingFileList).map((file) => {
        const isTooLarge = file.size > maxSizeMB * 1024 * 1024;
        return {
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          name: file.name,
          size: file.size,
          progress: isTooLarge ? 0 : 100,
          status: isTooLarge ? 'error' : 'complete',
          errorMessage: isTooLarge ? `File exceeds ${maxSizeMB}MB limit` : undefined,
          file,
        };
      });

      const updated = multiple ? [...currentFiles, ...newFiles] : newFiles;
      if (!isControlled) {
        setInternalFiles(updated);
      }
      onFilesChange?.(updated);
    };

    const handleRemove = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const updated = currentFiles.filter((f) => f.id !== id);
      if (!isControlled) {
        setInternalFiles(updated);
      }
      onFilesChange?.(updated);
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) setIsDragOver(true);
    };

    const handleDragLeave = () => {
      setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (!disabled) {
        handleFiles(e.dataTransfer.files);
      }
    };

    return (
      <div ref={ref} className={`ds-file-upload ${className}`}>
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label={label}
          onClick={() => !disabled && inputRef.current?.click()}
          onKeyDown={(e) => {
            if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`ds-file-upload-dropzone ${
            isDragOver ? 'ds-file-upload-dropzone--dragover' : ''
          } ${disabled ? 'ds-file-upload-dropzone--disabled' : ''}`}
        >
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            onChange={(e) => handleFiles(e.target.files)}
            className="ds-file-upload-input"
            tabIndex={-1}
          />

          <div className="ds-file-upload-icon" aria-hidden="true">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>

          <strong className="ds-file-upload-title">{label}</strong>
          <p className="ds-file-upload-hint">{hint}</p>
        </div>

        {currentFiles.length > 0 && (
          <ul className="ds-file-upload-list">
            {currentFiles.map((file) => (
              <li key={file.id} className="ds-file-upload-item">
                <div className="ds-file-upload-item-info">
                  <Icon name="check" size="sm" />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <span className="ds-file-upload-item-name">{file.name}</span>
                      <span className="ds-file-upload-item-size">
                        ({formatFileSize(file.size)})
                      </span>
                    </div>
                    {file.status === 'error' && (
                      <div style={{ color: 'var(--status-critical-solid)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-half)' }}>
                        {file.errorMessage}
                      </div>
                    )}
                  </div>
                </div>

                <div className="ds-file-upload-item-actions">
                  {file.status === 'complete' && (
                    <Badge variant="success">Uploaded</Badge>
                  )}
                  {file.status === 'error' && (
                    <Badge variant="danger">Failed</Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={`Remove file ${file.name}`}
                    onClick={(e) => handleRemove(file.id, e)}
                  >
                    ✕
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';
