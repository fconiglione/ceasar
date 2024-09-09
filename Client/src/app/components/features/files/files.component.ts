import { Component, ElementRef } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faChevronDown, faSearch, faDownload, faPhone, faEnvelope, faEllipsisV, faCircleInfo, faEye, faEdit, faTrash, faArrowLeft, faSort, faBars, faTableCells, faUserAlt, faArrowRightToBracket, faXmark, faPenToSquare, faSquare, faFile, faFileVideo, faFileImage, faFileLines, faFolder } from '@fortawesome/free-solid-svg-icons';
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

  // Folder components
  FOLDER: any;
  // folder_id: string | undefined;
  name: string | undefined = ''; // Prevents form submission with empty name
  parent_folder_id: string | null | undefined;
  // sub: string | undefined;
  // workspace_id: string | undefined;
  // created_at: string | undefined;
  // updated_at: string | undefined;

  // File components
  LEAD: any;
  sub: string | undefined;
  folder_id: string | null | undefined;
  file_id: string | undefined;
  workspace_id: string | undefined;
  created_at: string | undefined;
  updated_at: string | undefined;
  description: string | undefined;
  size: number | undefined;
  resource_type: string | undefined;
  public_id: string | undefined;
  file_url: string | undefined;
  type: string | undefined;

  // Component actions
  files_action_container: boolean = false;
  files_action_sidebar_container: boolean = false;
  file_edit_mode: boolean = false;
  folder_edit_mode: boolean = false;
  loading: boolean = true;
  more_info_dropdown: boolean = false;
  card_view: boolean = true;
  list_view: boolean = false;
  sort_by_dropdown: boolean = false;
  file_action_status_menu: boolean = false;
  folder_action_container: boolean = false;
  folders_action_sidebar_container: boolean = false;

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
  allFolders: any[] = [];
  filteredFolders: any[] = [];
  currentFolderId: string | undefined;
  parentFolders: any[] = [];

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
  faFolder = faFolder;

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
      this.sortFiles('name'); // Sort by name by default
      this.loading = false;
    });
  }

  getFolders(): void {
    // Get folders from the API
    this.fileService.getFolders(this.currentWorkspaceId).subscribe((folders: any) => {
      this.allFolders = folders;
      this.filteredFolders = folders;
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

  updateFile(): void {
    if (confirm('Are you sure you want to make changes to this file? All changes are final and cannot be undone.')) {
      let updatedFile = {
        file_id: this.file_id,
        name: this.name,
        description: this.description,
        sub: this.sub,
        updated_at: new Date().toISOString(),
        workspace_id: this.currentWorkspaceId,
        folder_id: this.folder_id
      };

      this.fileService.updateFile(updatedFile).subscribe(response => {
        console.log(response);
        this.getFiles();
        this.onReset();
      });
    }
  }

  deleteFile(): void {
    if (confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      this.fileService.deleteFile(this.public_id, this.resource_type).subscribe(response => {
        console.log(response);
        this.getFiles();
        this.onReset();
      });
    }
  }

  deleteFolder(): void {  }

  updateFolder(): void { 
    if (confirm('Are you sure you want to make changes to this folder? All changes are final and cannot be undone.')) {
      let updatedFolder = {
        folder_id: this.folder_id,
        name: this.name,
        sub: this.sub,
        updated_at: new Date().toISOString(),
        workspace_id: this.currentWorkspaceId,
        parent_folder_id: this.parent_folder_id
      };

      this.fileService.updateFolder(updatedFolder).subscribe(response => {
        console.log(response);
        this.getFolders();
        this.onReset();
      });
    }
   }

  onInputChange(event: any) {
    const searchInputValue = event.target.value.trim().toLowerCase();
    this.fileSearchInputValue = searchInputValue;
  
    if (this.fileSearchInputValue.length > 0) {
      this.filteredFiles = this.allFiles.filter((file: any) => {
        const name = file.name?.toLowerCase() ?? '';
        const resource_type = file.resource_type?.toLowerCase() ?? '';
        const created_at = file.created_at?.toLowerCase() ?? '';
        const updated_at = file.updated_at?.toLowerCase() ?? '';
  
        return name.includes(this.fileSearchInputValue) ||
          resource_type.includes(this.fileSearchInputValue) ||
          created_at.includes(this.fileSearchInputValue) ||
          updated_at.includes(this.fileSearchInputValue);
        });

        this.filteredFolders = this.allFolders.filter((folder: any) => {
          const name = folder.name?.toLowerCase() ?? '';
          const created_at = folder.created_at?.toLowerCase() ?? '';
          const updated_at = folder.updated_at?.toLowerCase() ?? '';

          return name.includes(this.fileSearchInputValue) ||
            created_at.includes(this.fileSearchInputValue) ||
            updated_at.includes(this.fileSearchInputValue);
        }
      );
    } else {
      this.filteredFolders = this.allFolders;
      this.filteredFiles = this.allFiles;
    }
  }


  openFilesActionSidebar(file: any): void {
    // Setting the file details
    this.file_id = file.file_id;
    this.name = file.name;
    this.description = file.description;
    this.created_at = file.created_at;
    this.updated_at = file.updated_at;
    this.size = file.size;
    this.resource_type = file.resource_type;
    this.public_id = file.public_id;
    this.file_url = file.file_url;
    this.type = file.type;
    this.folder_id = file.folder_id;
    // Opening the files action sidebar
    // this.onReset();
    this.files_action_sidebar_container = true;
  }

  openFoldersActionSidebar(folder: any): void {
    // Setting the folder details
    this.folder_id = folder.folder_id;
    this.name = folder.name;
    this.created_at = folder.created_at;
    this.updated_at = folder.updated_at;
    this.parent_folder_id = folder.parent_folder_id;
    // Opening the folders action sidebar container
    this.folders_action_sidebar_container = true;
    // Getting parent folders
    this.currentFolderId = folder.folder_id;
    this.getParentFolders();
  }

  sortFiles(sortFactor: any): void {
    if (sortFactor === 'name') {
      this.filteredFiles.sort((a: any, b: any) => {
        const nameA = a.name?.toLowerCase() ?? '';
        const nameB = b.name?.toLowerCase() ?? '';

        return nameA.localeCompare(nameB);
      });

      this.filteredFolders.sort((a: any, b: any) => {
        const nameA = a.name?.toLowerCase() ?? '';
        const nameB = b.name?.toLowerCase() ?? '';

        return nameA.localeCompare(nameB);
      });
      this.active_sort_factor = 'By File Name';
    }

    if (sortFactor === 'type') {
      this.filteredFiles.sort((a: any, b: any) => {
        const typeA = a.resource_type?.toLowerCase() ?? '';
        const typeB = b.resource_type?.toLowerCase() ?? '';

        return typeA.localeCompare(typeB);
      });
      this.active_sort_factor = 'By File Type';
    }

    if (sortFactor === 'size') {
      this.filteredFiles.sort((a: any, b: any) => {
        const sizeA = a.size;
        const sizeB = b.size;

        return sizeA - sizeB;
      });

      this.filteredFolders.sort((a: any, b: any) => {
        const sizeA = a.size;
        const sizeB = b.size;

        return sizeA - sizeB;
      });
      this.active_sort_factor = 'By File Size';
    }

    if (sortFactor === 'created_at') {
      this.filteredFiles.sort((a: any, b: any) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);

        return dateB.getTime() - dateA.getTime();
      });

      this.filteredFolders.sort((a: any, b: any) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);

        return dateB.getTime() - dateA.getTime();
      });
      this.active_sort_factor = 'By Date Created';
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
      csv += `${file.last_name}, ${file.first_name}, ${file.title}, ${file.company}, ${file.phone_number}, ${file.email}, ${file.source}, ${file.owner}\n`;
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

  getParentFolders() {
    this.parentFolders = this.allFolders.filter(folder => folder.folder_id !== this.currentFolderId && folder.parent_folder_id === null);
  }

  // Folder actions
  createFolder(): void {
    const newFolder = {
      sub: this.sub,
      name: this.name,
      // parent_folder_id: this.parent_folder_id,
      workspace_id: this.currentWorkspaceId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.fileService.createFolder(newFolder).subscribe(response => {
      console.log(response);
      this.onReset();
      this.getFolders();
    });
  }

  // Download files action

  downloadUrl: string = '';

  downloadFile(file_url: any, name: any) {
    const downloadUrl = `${file_url}`;
    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.download = name || 'unknown';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  onReset(): void {
    // Reset the new file form
    this.created_at = '';
    this.updated_at = '';
    this.description = '';
    this.size = 0;
    this.resource_type = '';
    this.public_id = '';
    this.file_url = '';
    this.type = '';
    this.file_id = '';
    this.name = '';
    this.folder_id = null;
    this.parent_folder_id = null;
    this.currentFolderId = '';

    // Close any open components
    this.files_action_sidebar_container = false;
    this.files_action_container = false
    this.file_edit_mode = false;
    this.file_action_status_menu = false;
    this.more_info_dropdown = false;
    this.folder_action_container = false;
    this.folders_action_sidebar_container = false;
    this.folder_edit_mode = false;
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
            this.getFolders();
          });
        }
      });
    } else {
      console.log('Not a workspace path');
    }
  }
}