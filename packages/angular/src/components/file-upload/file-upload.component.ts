import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface UploadedFileData {
  id: string;
  name: string;
  size: number;
  status: 'complete' | 'error';
  errorMessage?: string;
}

let nextUploadId = 0;

@Component({
  selector: 'ds-file-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ds-file-upload" [class]="customClass">
      <div
        role="button"
        [attr.tabindex]="disabled ? -1 : 0"
        [attr.aria-label]="label || 'Upload files'"
        [attr.aria-disabled]="disabled"
        (click)="!disabled && fileInput.click()"
        (keydown.enter)="!disabled && fileInput.click()"
        (keydown.space)="!disabled && ($event.preventDefault(), fileInput.click())"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave()"
        (drop)="onDrop($event)"
        class="ds-file-upload-dropzone"
        [class.ds-file-upload-dropzone--dragover]="isDragOver"
        [class.ds-file-upload-dropzone--disabled]="disabled"
      >
        <input
          #fileInput
          type="file"
          [accept]="accept"
          [multiple]="multiple"
          [disabled]="disabled"
          (change)="onFileChange($event)"
          class="ds-file-upload-input"
        />

        <div class="ds-file-upload-icon" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        </div>

        <h4 class="ds-file-upload-title">{{ label }}</h4>
        <p class="ds-file-upload-hint">{{ hint }}</p>
      </div>

      <ul *ngIf="files.length > 0" class="ds-file-upload-list">
        <li *ngFor="let file of files" class="ds-file-upload-item">
          <div class="ds-file-upload-item-info">
            <div style="min-width: 0; flex: 1;">
              <span class="ds-file-upload-item-name">{{ file.name }}</span>
              <span class="ds-file-upload-item-size">({{ formatSize(file.size) }})</span>
              <div *ngIf="file.status === 'error'" style="color: #DC2626; font-size: 12px;">
                {{ file.errorMessage }}
              </div>
            </div>
          </div>

          <button
            type="button"
            class="ds-file-remove-btn"
            [attr.aria-label]="'Remove ' + file.name"
            (click)="removeFile(file.id, $event)"
          >
            ✕
          </button>
        </li>
      </ul>
    </div>
  `,
  styleUrls: ['./file-upload.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsFileUploadComponent {
  @Input() accept?: string;
  @Input() maxSizeMB = 10;
  @Input() multiple = true;
  @Input() disabled = false;
  @Input() label = 'Click to upload or drag & drop';
  @Input() hint = 'PDF, PNG, JPG, or CSV up to 10MB';
  @Input() files: UploadedFileData[] = [];
  @Input() customClass = '';

  @Output() filesChange = new EventEmitter<UploadedFileData[]>();

  isDragOver = false;

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  }

  onDragOver(e: DragEvent): void {
    e.preventDefault();
    if (!this.disabled) this.isDragOver = true;
  }

  onDragLeave(): void {
    this.isDragOver = false;
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.isDragOver = false;
    if (!this.disabled && e.dataTransfer?.files) {
      this.processFiles(e.dataTransfer.files);
    }
  }

  onFileChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files) {
      this.processFiles(input.files);
    }
  }

  processFiles(fileList: FileList): void {
    const newFiles: UploadedFileData[] = Array.from(fileList).map((file) => {
      const isTooLarge = file.size > this.maxSizeMB * 1024 * 1024;
      return {
        id: `${file.name}-${Date.now()}-${++nextUploadId}`,
        name: file.name,
        size: file.size,
        status: isTooLarge ? 'error' : 'complete',
        errorMessage: isTooLarge ? `File exceeds ${this.maxSizeMB}MB limit` : undefined,
      };
    });

    this.files = this.multiple ? [...this.files, ...newFiles] : newFiles;
    this.filesChange.emit(this.files);
  }

  removeFile(id: string, e: MouseEvent): void {
    e.stopPropagation();
    this.files = this.files.filter((f) => f.id !== id);
    this.filesChange.emit(this.files);
  }
}
