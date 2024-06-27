import { Component, ElementRef, ViewChild } from '@angular/core';
import { faUpload, faSearch, faChevronDown, faEye, faDownload, faTrash, faFile, faImage, faVideo } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { Router, ActivatedRoute } from '@angular/router';
import { FilesService } from '../../../services/files/files.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from '../../loading/loading.component';

@Component({
  selector: 'app-files',
  standalone: true,
  imports: [
    FaIconComponent,
    CommonModule, FormsModule,
    LoadingComponent
  ],
  templateUrl: './files.component.html',
  styleUrl: './files.component.css'
})
export class FilesComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  // Files info
  FILE: any;

  faUpload = faUpload;
  faSearch = faSearch;
  faChevronDown = faChevronDown;
  faDownload = faDownload;
  faTrash = faTrash;
  faFile = faFile;
  faEye = faEye;
  faImage = faImage;
  faVideo = faVideo;

  ShapesBanner = "assets/images/shapes-banner.svg";
  loading: boolean = true;
  currentWorkspaceId: string | undefined;

  constructor(private elementRef: ElementRef, private filesService: FilesService, private route: ActivatedRoute, private router: Router) { }

  getFiles(): void {
    // Get files from the API
    this.filesService.getFiles(this.currentWorkspaceId).subscribe(response => {
      this.FILE = response;
      this.applyFilter();
      this.loading = false;
    });
  }

  openNewFilePopup(): void {
    // Open the new file popup
    const newFilePopup = this.elementRef.nativeElement.querySelector('.create-file-pop-up');
    newFilePopup.style.display = 'block';
  }

  filesFilterDropdownActive: boolean = false;

  closeFilterFilesDropdown(): void {
    const filesFilterDropdown = this.elementRef.nativeElement.querySelector('.filter-dropdown');
    if (filesFilterDropdown) {
      filesFilterDropdown.style.display = 'none';
      this.filesFilterDropdownActive = false;
    }
  }  

  openFilterFilesDropdown(): void {
    const filesFilterDropdown = this.elementRef.nativeElement.querySelector('.filter-dropdown');
    if (filesFilterDropdown) {
      this.filesFilterDropdownActive = !this.filesFilterDropdownActive;
      filesFilterDropdown.style.display = this.filesFilterDropdownActive ? 'flex' : 'none';
    }
  }

  previousFilter: string = 'Name';
  activeFilter: string = 'Name';

  filterFiles(activeFilter: string): void {
    this.closeFilterFilesDropdown();
    if (activeFilter === this.previousFilter) {
        this.activeFilter = 'Name';
        this.previousFilter = 'Name';
    } else {
        this.activeFilter = activeFilter;
        this.previousFilter = activeFilter;
    }
    this.getFiles();
}

applyFilter(): void {
  if (this.activeFilter === 'Name') {
      this.FILE.sort((a: any, b: any) => a.name.localeCompare(b.name));
  } else if (this.activeFilter === 'Type') {
      this.FILE.sort((a: any, b: any) => a.resource_type.localeCompare(b.resource_type));
  } else if (this.activeFilter === 'Size') {
    this.FILE.sort((a: any, b: any) => a.size.localeCompare(b.size));
  } else if (this.activeFilter === 'Creation Date') {
    this.FILE.sort((a: any, b: any) => new Date(a.creation_date).getTime() - new Date(b.creation_date).getTime());
}
}

convertFileSize(size: any) {
  if (size < 1024) {
    return size + ' Bytes';
  } else if (size >= 1024 && size < 1048576) {
    return (size / 1024).toFixed(2) + ' KB';
  } else if (size >= 1048576 && size < 1073741824) {
    return (size / 1048576).toFixed(2) + ' MB';
  } else if (size >= 1073741824) {
    return (size / 1073741824).toFixed(2) + ' GB';
  } else {
    return 0 + ' Bytes';
  }
}

fileSearchInputValue: string = '';

onInputChange(event: any) {
  const searchInputValue = event.target.value.trim();
  this.fileSearchInputValue = searchInputValue;

  if (this.fileSearchInputValue === '') {
    this.getFiles();
  } else {
    this.FILE = this.FILE.filter((file: any) => {
      const name = file.name?.toLowerCase() ?? '';
      const type = file.type?.toLowerCase() ?? '';
      const size = file.size?.toLowerCase() ?? '';
      const resourceType = file.resource_type?.toLowerCase() ?? '';

      return name.includes(this.fileSearchInputValue.toLowerCase()) ||
        type.includes(this.fileSearchInputValue.toLowerCase()) ||
        size.includes(this.fileSearchInputValue.toLowerCase()) ||
        resourceType.includes(this.fileSearchInputValue.toLowerCase());
            });
  }
}  

downloadUrl: string = '';

downloadFile(file: any) {
  this.downloadUrl = `${file.file_url}`;
  window.open(this.downloadUrl, '_blank');
}

deleteFile(publicId: any, resourceType: any) {
  if (confirm('Are you sure you want to delete this file?')) {
    // Delete the file
    this.filesService.deleteFile(publicId, resourceType).subscribe(response => {
      console.log(response);
      this.getFiles();
    });
  }
}

isWorkspacePath(): boolean {
  return this.router.url.startsWith('/ws');
}

ngOnInit() {
  if (this.isWorkspacePath()) {
    this.route.queryParams.subscribe(params => {
      this.currentWorkspaceId = params['workspace_id'] || '';
      this.getFiles();
    });
  } else {
    console.log('Not a workspace path');
  }
}

importFile(event: any) {
  // Import the file
  const file = event.target.files[0];
  this.filesService.uploadFile(file, this.currentWorkspaceId).subscribe(response => {
    console.log(response);
    this.getFiles();
  });
  this.getFiles();
}

}
