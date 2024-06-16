import { Component, ElementRef, ViewChild } from '@angular/core';
import { faUpload, faSearch, faChevronDown, faEye, faDownload, faTrash, faFile } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { Router, ActivatedRoute } from '@angular/router';
import { FilesService } from '../../../services/files/files.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-files',
  standalone: true,
  imports: [
    FaIconComponent,
    CommonModule, FormsModule
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

  ShapesBanner = "assets/images/shapes-banner.svg";
  loading: boolean = true;
  currentWorkspaceId: string | undefined;

  constructor(private elementRef: ElementRef, private filesService: FilesService, private route: ActivatedRoute, private router: Router) { }

  getFiles(): void {
    // Get files from the API
    this.filesService.getFiles(this.currentWorkspaceId).subscribe(response => {
      this.FILE = response;
      // this.applyFilter();
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

  previousFilter: string = 'All Files';
  activeFilter: string = 'All Files';

  filterFiles(activeFilter: string): void {
    this.closeFilterFilesDropdown();
    if (activeFilter === this.previousFilter) {
        this.activeFilter = 'All Files';
        this.previousFilter = 'All Files';
    } else {
        this.activeFilter = activeFilter;
        this.previousFilter = activeFilter;
    }
    this.getFiles();
}

applyFilter(): void {
  if (this.activeFilter === 'All Files') {
      this.FILE.sort((a: any, b: any) => a.first_name.localeCompare(b.first_name));
  } else if (this.activeFilter === 'Company') {
      this.FILE.sort((a: any, b: any) => a.company.localeCompare(b.company));
  } else if (this.activeFilter === 'Creation Date') {
      this.FILE.sort((a: any, b: any) => new Date(a.creation_date).getTime() - new Date(b.creation_date).getTime());
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
      const firstName = file.first_name?.toLowerCase() ?? '';
      const lastName = file.last_name?.toLowerCase() ?? '';
      const company = file.company?.toLowerCase() ?? '';
      const phoneNumber = file.phone_number?.toLowerCase() ?? '';
      const email = file.email?.toLowerCase() ?? '';

      return firstName.includes(this.fileSearchInputValue.toLowerCase()) ||
        lastName.includes(this.fileSearchInputValue.toLowerCase()) ||
        company.includes(this.fileSearchInputValue.toLowerCase()) ||
        phoneNumber.includes(this.fileSearchInputValue.toLowerCase()) ||
        email.includes(this.fileSearchInputValue.toLowerCase());
      });
  }
}  

downloadUrl: string = '';

downloadFile(file: any) {
  const filename = file.file_name;
  const encodedFilename = encodeURIComponent(filename);
  this.downloadUrl = `${file.file_url}?filename=${encodedFilename}`;
  window.open(this.downloadUrl, '_blank');
}

// onReset(): void {
//   // Reset the new contact form
// }

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
}

}
