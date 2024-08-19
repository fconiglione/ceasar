import { Component, ElementRef } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faChevronDown, faSearch, faDownload, faPhone, faEnvelope, faEllipsisV, faCircleInfo, faEye, faEdit, faTrash, faArrowLeft, faSort, faBars, faTableCells, faUserAlt, faArrowRightToBracket, faXmark, faPenToSquare, faSquare, faFile, faFileVideo, faFileImage, faFileLines } from '@fortawesome/free-solid-svg-icons';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { FilesService } from '../../../services/files/files.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from '../../loading/loading.component';
import { AuthService } from '@auth0/auth0-angular';
import { NoDataComponent } from "../../no-data/no-data.component";

@Component({
  selector: 'app-files',
  standalone: true,
  imports: [
    FaIconComponent,
    NgFor,
    NgIf,
    DatePipe,
    CommonModule,
    FormsModule,
    LoadingComponent,
    NoDataComponent
],
  templateUrl: './files.component.html',
  styleUrl: './files.component.css'
})
export class FilesComponent {
  // User components
  username: string | undefined;

  // File components
  LEAD: any;
  sub: string | undefined;
  file_id: string | undefined;
  workspace_id: string | undefined;
  title: string | undefined = "";
  first_name: string | undefined;
  last_name: string | undefined;
  file_status_id: string | undefined = "";
  photo_url: string | undefined;
  company: string | undefined;
  phone_number: string | undefined;
  email: string | undefined;
  source: string | undefined;
  created_at: string | undefined;
  updated_at: string | undefined;

  // Component actions
  files_action_container: boolean = false;
  files_action_sidebar_container: boolean = false;
  file_edit_mode: boolean = false;
  loading: boolean = true;
  more_info_dropdown: boolean = false;
  card_view: boolean = true;
  list_view: boolean = false;
  sort_by_dropdown: boolean = false;
  file_action_status_menu: boolean = false;

  // Other variables
  file_status: string | undefined;
  file_count: number = 0;
  file_status_new_count: number = 0;
  file_status_contacted_count: number = 0;
  file_status_qualified_count: number = 0;
  file_status_closed_won_count: number = 0;
  file_status_closed_lost_count: number = 0;
  previous_status_filter: number = 0;
  active_status_filter: number = 0;
  active_sort_factor: string = 'By File Name';
  allFiles: any[] = [];  // This should be initialized with the complete list of files
  filteredFiles: any[] = [];

  // Font Awesome icons
  faChevronDown = faChevronDown;
  faSearch = faSearch;
  faDownload = faDownload;
  faPhone = faPhone;
  faEnvelope = faEnvelope;
  faEllipsisV = faEllipsisV;
  faCircleInfo = faCircleInfo;
  faEye = faEye;
  faEdit = faEdit;
  faTrash = faTrash;
  faArrowLeft = faArrowLeft;
  faUserAlt = faUserAlt;
  faSort = faSort;
  faBars = faBars;
  faTableCells = faTableCells;
  faArrowRightToBracket = faArrowRightToBracket;
  faXmark = faXmark;
  faPenToSquare = faPenToSquare;
  faSquare = faSquare;
  faFile = faFile;
  faFileVideo = faFileVideo;
  faFileImage = faFileImage;
  faFileLines = faFileLines;

  currentWorkspaceId: string | undefined;

  fileSearchInputValue: string = '';
  activeStatusFilter: string = 'All status';

  ShapesBanner = "assets/images/shapes-banner.svg";
  DefaultPFP = "assets/images/default-pfp.svg";

  constructor( private fileService: FilesService, private route: ActivatedRoute, private router: Router, private elementRef: ElementRef, private authService: AuthService ) { }

  getFiles(): void {
    // Get files from the API
    this.fileService.getFiles(this.currentWorkspaceId).subscribe((files: any) => {
      // this.filteredFiles = response;
      this.allFiles = files;
      this.filteredFiles = files;
      this.countFiles();
      this.sortFiles('name'); // Sort by name by default
      this.loading = false;
    });
  }

  importFile(event: any) {
    // Import the file
    const file = event.target.files[0];
    const info = {
      sub: this.sub,
      created_at: new Date().toISOString(),
      workspace_id: this.currentWorkspaceId
    };
    this.fileService.uploadFile(file, info).subscribe(response => {
      console.log(response);
      this.getFiles();
    });
    this.getFiles();
  }

  // updateFile(): void {
  //   if (confirm('Are you sure you want to make changes to this file? All changes are final and cannot be undone.')) {
  //     let updatedFile = {
  //       file_id: this.file_id,
  //       title: this.title,
  //       first_name: this.first_name,
  //       last_name: this.last_name,
  //       company: this.company,
  //       phone_number: this.phone_number,
  //       email: this.email,
  //       file_status_id: this.file_status_id,
  //       photo_url: this.photo_url,
  //       source: this.source,
  //       updated_at: new Date().toISOString(),
  //       workspace_id: this.currentWorkspaceId
  //     };

  //     this.fileService.updateFile(updatedFile).subscribe(response => {
  //       console.log(response);
  //       this.getFiles();
  //       this.onReset();
  //     });
  //   }
  // }

  // deleteFile(): void {
  //   if (confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
  //     this.fileService.deleteFile(this.file_id).subscribe(response => {
  //       console.log(response);
  //       this.getFiles();
  //       this.onReset();
  //     });
  //   }
  // }

  // // Deletion from directly within the list
  // deleteFileById(file_id: string): void {
  //   if (confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
  //     this.fileService.deleteFile(file_id).subscribe(response => {
  //       console.log(response);
  //       this.getFiles();
  //     });
  //   }
  // }

  getFileStatus(file_status_id: any) {
    switch (file_status_id) {
      case 1:
        return 'New';
      case 2:
        return 'Contacted';
      case 3:
        return 'Qualified';
      case 4:
        return 'Closed-Won';
      case 5:
        return 'Closed-Lost';
      default:
        return 'Not provided';
    }
  }

  getFileStatusClasses(file_status_id: any) {
    switch (file_status_id) {
      case 1:
        return { 'file-status': true, 'new': true };
      case 2:
        return { 'file-status': true, 'contacted': true };
      case 3:
        return { 'file-status': true, 'qualified': true };
      case 4:
        return { 'file-status': true, 'closed-won': true };
      case 5:
        return { 'file-status': true, 'closed-lost': true };
      default:
        return { 'file-status': true, 'not-provided': true };
    }
  }

  onInputChange(event: any) {
    const searchInputValue = event.target.value.trim().toLowerCase();
    this.fileSearchInputValue = searchInputValue;
  
    if (this.fileSearchInputValue.length > 0) {
      this.countFiles();
      this.filteredFiles = this.allFiles.filter((file: any) => {
        const title = file.title?.toLowerCase() ?? '';
        const firstName = file.first_name?.toLowerCase() ?? '';
        const lastName = file.last_name?.toLowerCase() ?? '';
        const company = file.company?.toLowerCase() ?? '';
        const phoneNumber = file.phone_number?.toLowerCase() ?? '';
        const email = file.email?.toLowerCase() ?? '';
        const status = this.getFileStatus(file.file_status_id).toLowerCase();
  
        return title.includes(this.fileSearchInputValue) ||
          firstName.includes(this.fileSearchInputValue) ||
          lastName.includes(this.fileSearchInputValue) ||
          company.includes(this.fileSearchInputValue) ||
          phoneNumber.includes(this.fileSearchInputValue) ||
          email.includes(this.fileSearchInputValue) ||
          status.includes(this.fileSearchInputValue);
      });
    } else {
      this.countFiles();
      this.filteredFiles = this.allFiles;
    }
  }

  countFiles(): void {
    this.file_count = this.filteredFiles.length;
    this.file_status_new_count = this.filteredFiles.filter((file: any) => file.file_status_id === 1).length;
    this.file_status_contacted_count = this.filteredFiles.filter((file: any) => file.file_status_id === 2).length;
    this.file_status_qualified_count = this.filteredFiles.filter((file: any) => file.file_status_id === 3).length;
    this.file_status_closed_won_count = this.filteredFiles.filter((file: any) => file.file_status_id === 4).length;
    this.file_status_closed_lost_count = this.filteredFiles.filter((file: any) => file.file_status_id === 5).length;
  } 
  
  filterFileStatus(file_status_id: number): void {
      this.active_status_filter = file_status_id;
      if (file_status_id === this.previous_status_filter) {
          this.getFiles();
          this.previous_status_filter = 0;
      } else {
          if (file_status_id === 0) {
            this.getFiles();
          } else {
              this.fileService.getFiles(this.currentWorkspaceId).subscribe(response => {
                  this.filteredFiles = response as any[];
                  this.countFiles();
                  this.filteredFiles = this.filteredFiles.filter((file: any) => file.file_status_id === file_status_id);
                  this.previous_status_filter = file_status_id;
                  this.activeStatusFilter = this.getFileStatus(file_status_id);
              });
          }
      }
  }

  openFilesActionSidebar(file: any): void {
    // Setting the file details
    this.file_id = file.file_id;
    this.title = file.title;
    this.first_name = file.first_name;
    this.last_name = file.last_name;
    this.company = file.company;
    this.phone_number = file.phone_number;
    this.email = file.email;
    this.file_status_id = file.file_status_id;
    this.photo_url = file.photo_url;
    this.source = file.source;
    this.created_at = file.created_at;
    this.updated_at = file.updated_at
    // Opening the files action sidebar
    // this.onReset();
    this.files_action_sidebar_container = true;
  }

  openFileStatusMenu(file: any): void {
    this.file_status_id = file.file_status_id;
    this.file_id = file.file_id;
    this.first_name = file.first_name;
    this.last_name = file.last_name;
    this.title = file.title;
    this.company = file.company;
    this.phone_number = file.phone_number;
    this.email = file.email;
    this.photo_url = file.photo_url;
    this.source = file.source;
    this.file_action_status_menu = true;
  }

  // updateFileStatus(file_status_id: any): void {
  //   let updatedFile = {
  //     file_status_id: file_status_id, // Take from new selected status
  //     file_id: this.file_id,
  //     title: this.title,
  //     first_name: this.first_name,
  //     last_name: this.last_name,
  //     company: this.company,
  //     phone_number: this.phone_number,
  //     email: this.email,
  //     photo_url: this.photo_url,
  //     source: this.source,
  //     updated_at: new Date().toISOString(),
  //     workspace_id: this.currentWorkspaceId
  //     };

  //   this.fileService.updateFile(updatedFile).subscribe(response => {
  //     console.log(response);
  //     this.getFiles();
  //     this.onReset();
  //   });
  // }

  sortFiles(sortFactor: any): void {
    if (sortFactor === 'last_name') {
      this.filteredFiles.sort((a: any, b: any) => {
        const lastNameA = a.last_name?.toLowerCase() ?? '';
        const lastNameB = b.last_name?.toLowerCase() ?? '';

        this.active_sort_factor = 'By Last Name';

        return lastNameA.localeCompare(lastNameB);
      });
    }

    if (sortFactor === 'first_name') {
      this.filteredFiles.sort((a: any, b: any) => {
        const firstNameA = a.first_name?.toLowerCase() ?? '';
        const firstNameB = b.first_name?.toLowerCase() ?? '';

        this.active_sort_factor = 'By First Name';

        return firstNameA.localeCompare(firstNameB);
      });
    }

    if (sortFactor === 'company') {
      this.filteredFiles.sort((a: any, b: any) => {
        const companyA = a.company?.toLowerCase() ?? '';
        const companyB = b.company?.toLowerCase() ?? '';

        this.active_sort_factor = 'By Company';

        return companyA.localeCompare(companyB);
      });
    }

    if (sortFactor === 'status') {
      this.filteredFiles.sort((a: any, b: any) => {
        const statusA = a.file_status_id;
        const statusB = b.file_status_id;

        this.active_sort_factor = 'By Status';

        return statusA - statusB;
      });
    }

    if (sortFactor === 'created_at') {
      this.filteredFiles.sort((a: any, b: any) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);

        this.active_sort_factor = 'By Date Created';

        return dateB.getTime() - dateA.getTime();
      });
    }

    this.sort_by_dropdown = false;
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

  // // CSV Exporting

  generateCSV(): string {
    let csv = 'Last Name, First Name, Title, Company, Phone Number, Email, Status, Source, Owner\n';

    this.filteredFiles.forEach((file: any) => {
      csv += `${file.last_name}, ${file.first_name}, ${file.title}, ${file.company}, ${file.phone_number}, ${file.email}, ${this.getFileStatus(file.file_status_id)}, ${file.source}, ${file.owner}\n`;
    });

    return csv;
  }

  downloadCSV(): void {
    const csvData = this.generateCSV();
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'files.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  printData(): void {
    // Print in csv format
    const csvData = this.generateCSV();
    const printWindow = window.open('', '', 'height=400,width=800');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Files</title>');
      printWindow.document.write('</head><body>');
      printWindow.document.write('<pre>');
      printWindow.document.write(csvData);
      printWindow.document.write('</pre>');
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  }

  // Card and list views
  toggleCardView() {
    this.card_view = !this.card_view;
    if (this.card_view && this.list_view) {
      this.list_view = false;
    } else if (!this.card_view && !this.list_view) {
      this.card_view = true;
    }
  }

  toggleListView() {
    this.list_view = !this.list_view;
    if (this.list_view && this.card_view) {
      this.card_view = false;
    } else if (!this.list_view && !this.card_view) {
      this.list_view = true;
    }
  }

  // Phone number formatting
  onPhoneNumberChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const numericValue = input.value.replace(/\D/g, '');
    
    this.phone_number = numericValue;
    this.formatPhoneNumber();
    input.value = this.phone_number;
  }

  formatPhoneNumber(): void {
    if (this.phone_number) {
      let formatted = this.phone_number;
      if (formatted.length > 6) {
        formatted = `(${formatted.slice(0, 3)}) ${formatted.slice(3, 6)}-${formatted.slice(6, 10)}`;
      } else if (formatted.length > 3) {
        formatted = `(${formatted.slice(0, 3)}) ${formatted.slice(3)}`;
      } else {
        formatted = formatted.slice(0, 3);
      }
      this.phone_number = formatted;
    }
  }

  onReset(): void {
    // Reset the new file form
    this.title = '';
    this.first_name = '';
    this.last_name = '';
    this.company = '';
    this.phone_number = '';
    this.email = '';
    this.file_status_id = '';
    this.photo_url = '';
    this.source = '';
    this.created_at = '';
    this.updated_at = '';

    // Close any open components
    this.files_action_sidebar_container = false;
    this.files_action_container = false
    this.file_edit_mode = false;
    this.file_action_status_menu = false;
    this.more_info_dropdown = false;
    this.filterFileStatus(0);
    this.getFiles();
  }

  isWorkspacePath(): boolean {
    return this.router.url.startsWith('/ws');
  }

  ngOnInit() {
    if (this.isWorkspacePath()) {
      this.authService.user$.subscribe(user => {
        if (user && user.sub) {
          this.sub = user.sub;
          this.username = user.nickname;
          this.route.queryParams.subscribe(params => {
            this.currentWorkspaceId = params['workspace_id'] || '';
            this.getFiles();
          });
        }
      });
    } else {
      console.log('Not a workspace path');
    }
  }
}

// import { Component, ElementRef, ViewChild } from '@angular/core';
// import { faUpload, faSearch, faChevronDown, faEye, faDownload, faTrash, faFile, faImage, faVideo } from '@fortawesome/free-solid-svg-icons';
// import { FaIconComponent } from "@fortawesome/angular-fontawesome";
// import { Router, ActivatedRoute } from '@angular/router';
// import { FilesService } from '../../../services/files/files.service';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { LoadingComponent } from '../../loading/loading.component';

// @Component({
//   selector: 'app-files',
//   standalone: true,
//   imports: [
//     FaIconComponent,
//     CommonModule, FormsModule,
//     LoadingComponent
//   ],
//   templateUrl: './files.component.html',
//   styleUrl: './files.component.css'
// })
// export class FilesComponent {
//   @ViewChild('fileInput') fileInput!: ElementRef;
//   // Files info
//   FILE: any;

//   faUpload = faUpload;
//   faSearch = faSearch;
//   faChevronDown = faChevronDown;
//   faDownload = faDownload;
//   faTrash = faTrash;
//   faFile = faFile;
//   faEye = faEye;
//   faImage = faImage;
//   faVideo = faVideo;

//   ShapesBanner = "assets/images/shapes-banner.svg";
//   loading: boolean = true;
//   currentWorkspaceId: string | undefined;

//   constructor(private elementRef: ElementRef, private filesService: FilesService, private route: ActivatedRoute, private router: Router) { }

//   getFiles(): void {
//     // Get files from the API
//     this.filesService.getFiles(this.currentWorkspaceId).subscribe(response => {
//       this.FILE = response;
//       this.applyFilter();
//       this.loading = false;
//     });
//   }

//   openNewFilePopup(): void {
//     // Open the new file popup
//     const newFilePopup = this.elementRef.nativeElement.querySelector('.create-file-pop-up');
//     newFilePopup.style.display = 'block';
//   }

//   filesFilterDropdownActive: boolean = false;

//   closeFilterFilesDropdown(): void {
//     const filesFilterDropdown = this.elementRef.nativeElement.querySelector('.filter-dropdown');
//     if (filesFilterDropdown) {
//       filesFilterDropdown.style.display = 'none';
//       this.filesFilterDropdownActive = false;
//     }
//   }  

//   openFilterFilesDropdown(): void {
//     const filesFilterDropdown = this.elementRef.nativeElement.querySelector('.filter-dropdown');
//     if (filesFilterDropdown) {
//       this.filesFilterDropdownActive = !this.filesFilterDropdownActive;
//       filesFilterDropdown.style.display = this.filesFilterDropdownActive ? 'flex' : 'none';
//     }
//   }

//   previousFilter: string = 'Name';
//   activeFilter: string = 'Name';

//   filterFiles(activeFilter: string): void {
//     this.closeFilterFilesDropdown();
//     if (activeFilter === this.previousFilter) {
//         this.activeFilter = 'Name';
//         this.previousFilter = 'Name';
//     } else {
//         this.activeFilter = activeFilter;
//         this.previousFilter = activeFilter;
//     }
//     this.getFiles();
// }

// applyFilter(): void {
//   if (this.activeFilter === 'Name') {
//       this.FILE.sort((a: any, b: any) => a.name.localeCompare(b.name));
//   } else if (this.activeFilter === 'Type') {
//       this.FILE.sort((a: any, b: any) => a.resource_type.localeCompare(b.resource_type));
//   } else if (this.activeFilter === 'Size') {
//     this.FILE.sort((a: any, b: any) => a.size.localeCompare(b.size));
//   } else if (this.activeFilter === 'Creation Date') {
//     this.FILE.sort((a: any, b: any) => new Date(a.creation_date).getTime() - new Date(b.creation_date).getTime());
// }
// }

// convertFileSize(size: any) {
//   if (size < 1024) {
//     return size + ' Bytes';
//   } else if (size >= 1024 && size < 1048576) {
//     return (size / 1024).toFixed(2) + ' KB';
//   } else if (size >= 1048576 && size < 1073741824) {
//     return (size / 1048576).toFixed(2) + ' MB';
//   } else if (size >= 1073741824) {
//     return (size / 1073741824).toFixed(2) + ' GB';
//   } else {
//     return 0 + ' Bytes';
//   }
// }

// fileSearchInputValue: string = '';

// onInputChange(event: any) {
//   const searchInputValue = event.target.value.trim();
//   this.fileSearchInputValue = searchInputValue;

//   if (this.fileSearchInputValue === '') {
//     this.getFiles();
//   } else {
//     this.FILE = this.FILE.filter((file: any) => {
//       const name = file.name?.toLowerCase() ?? '';
//       const type = file.type?.toLowerCase() ?? '';
//       const size = file.size?.toLowerCase() ?? '';
//       const resourceType = file.resource_type?.toLowerCase() ?? '';

//       return name.includes(this.fileSearchInputValue.toLowerCase()) ||
//         type.includes(this.fileSearchInputValue.toLowerCase()) ||
//         size.includes(this.fileSearchInputValue.toLowerCase()) ||
//         resourceType.includes(this.fileSearchInputValue.toLowerCase());
//             });
//   }
// }  

// downloadUrl: string = '';

// downloadFile(file: any) {
//   this.downloadUrl = `${file.file_url}`;
//   window.open(this.downloadUrl, '_blank');
// }

// deleteFile(publicId: any, resourceType: any) {
//   if (confirm('Are you sure you want to delete this file?')) {
//     // Delete the file
//     this.filesService.deleteFile(publicId, resourceType).subscribe(response => {
//       console.log(response);
//       this.getFiles();
//     });
//   }
// }

// isWorkspacePath(): boolean {
//   return this.router.url.startsWith('/ws');
// }

// ngOnInit() {
//   if (this.isWorkspacePath()) {
//     this.route.queryParams.subscribe(params => {
//       this.currentWorkspaceId = params['workspace_id'] || '';
//       this.getFiles();
//     });
//   } else {
//     console.log('Not a workspace path');
//   }
// }

// importFile(event: any) {
//   // Import the file
//   const file = event.target.files[0];
//   this.filesService.uploadFile(file, this.currentWorkspaceId).subscribe(response => {
//     console.log(response);
//     this.getFiles();
//   });
//   this.getFiles();
// }

// }
