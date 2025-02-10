import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-file-uploader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css'],
})
export class FileUploaderComponent {
  @Input() selectedFile: File | null = null;
  @Input() error: string = '';
  @Input() attachmentType: string = '';

  filePreview: string | null = null;

  @Output() fileSelectedEvent = new EventEmitter<File>();
  @Output() cancelFileUploadEvent = new EventEmitter();
  @Output() reTryFileSelectionEvent = new EventEmitter();

  ngOnInit(): void {
    if (this.attachmentType === 'image') {
      const reader = new FileReader();
      reader.onload = () => {
        this.filePreview = reader.result as string;
      };
      if (this.selectedFile) reader.readAsDataURL(this.selectedFile);
    }
  }

  shareFile() {
    if (this.selectedFile) {
      this.fileSelectedEvent.emit(this.selectedFile);
      this.reset();
    }
  }

  reTry() {
    this.reTryFileSelectionEvent.emit(this.attachmentType);
    this.error = '';
    this.selectedFile = null;
  }

  reset() {
    this.selectedFile = null;
    this.filePreview = null;
    this.error = '';
    this.cancelFileUploadEvent.emit();
  }
  
  ngDoCheck(): void {
    if (this.attachmentType === 'image') {
      const reader = new FileReader();
      reader.onload = () => {
        this.filePreview = reader.result as string;
      };
      if (this.selectedFile) reader.readAsDataURL(this.selectedFile);
    }
  }
}
