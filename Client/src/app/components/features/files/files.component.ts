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
  showAllFolders: boolean = false;

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
  folder_size: number = 0;
  openFolders: any[] = [];
  folderIndex: number[] = [];

  // Storage variables
  used_storage: number = 0;
  total_storage: number = 0;

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

  constructor(private fileService: FilesService, private route: ActivatedRoute, private router: Router, private elementRef: ElementRef, private authService: AuthService) { }

  getFiles(): void {
    // Get files from the API
    this.fileService.getFiles(this.currentWorkspaceId).subscribe({
      next: (files: any) => {
        // Store all files and filter for files with no folder_id
        this.allFiles = files;
        this.filteredFiles = files.filter((file: any) => file.folder_id === null);
        this.sortFiles('name'); // Sort by name by default
        this.loading = false; // Hide the loading spinner
      },
      error: (err) => {
        console.error('Failed to load files', err);
        this.loading = false; // Hide the loading spinner in case of error
      }
    });
  }

  getFolders(): void {
    // Get folders from the API
    this.fileService.getFolders(this.currentWorkspaceId).subscribe({
      next: (folders: any) => {
        this.allFolders = folders;
        this.filteredFolders = folders.filter((folder: any) => folder.parent_folder_id === null);
      },
      error: (err) => {
        console.error('Failed to load folders', err);
      }
    });
  }

  getFolderComponents(selected_folder: any) {
    this.folder_id = selected_folder.folder_id;
    if (selected_folder.folder_id) {
      const folderIndexValue = this.openFolders.findIndex(folder => folder.folder_id === selected_folder.folder_id);

      if (folderIndexValue > -1) {
        this.openFolders.splice(folderIndexValue + 1);
      } else {
        this.openFolders.push(selected_folder);
      }
      this.filteredFiles = this.allFiles.filter((file: any) => file.folder_id === selected_folder.folder_id);
      this.filteredFolders = this.allFolders.filter((folder: any) => folder.parent_folder_id === selected_folder.folder_id);
    }
  }

  showMoreFolders() {
    this.showAllFolders = !this.showAllFolders;
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

  deleteFolder(): void {
    if (confirm('Are you sure you want to delete this folder? All files and folders will also be deleted. This action cannot be undone.')) {
      this.fileService.deleteFolder(this.folder_id).subscribe(response => {
        console.log(response);
        this.getFolders();
        this.clearFolderSelection();
        this.onReset();
      });
    }
  }

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
        this.clearFolderSelection();
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
      this.getFiles();
      this.getFolders();
      // this.filteredFolders = this.allFolders;
      // this.filteredFiles = this.allFiles;
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
    this.getParentFolders(this.currentFolderId);
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

  getFolderSize(folder_id: any) {
    this.folder_size = 0;
    this.allFiles.forEach((file: any) => {
      if (file.folder_id === folder_id) {
        this.folder_size += file.size;
      }
    });

    // Remove leading zeroes
    const sizeWithoutLeadingZeroes = Number(this.folder_size).toString();

    // Convert the size to a readable format
    return this.convertFileSize(sizeWithoutLeadingZeroes);
  }

  exportAllFiles(): void {
    // Download all files in a zip format
    if (confirm('Are you sure you want to download all files? This action may take a while depending on the number and size of files.')) {
      this.allFiles.forEach(file => {
        if (file.file_url && file.name) {
          this.downloadFile(file.file_url, file.name);
        }
      });
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

  getParentFolders(currentFolderId: string | undefined) {
    if (!currentFolderId) {
      this.parentFolders = [];
      return;
    }
  
    // const currentFolder = this.allFolders.find((folder: any) => folder.folder_id === currentFolderId);
  
    const descendantFolderIds = new Set<string>();
    const getDescendants = (folderId: string) => {
      this.allFolders.forEach((folder: any) => {
        if (folder.parent_folder_id === folderId) {
          descendantFolderIds.add(folder.folder_id);
          getDescendants(folder.folder_id);
        }
      });
    };
  
    getDescendants(currentFolderId);
  
    this.parentFolders = this.allFolders.filter((folder: any) => {
      return folder.folder_id !== currentFolderId && // Exclude the current folder
             !descendantFolderIds.has(folder.folder_id); // Exclude descendant folders
    });
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
    // Folder_id mustn't be reset to allow for folder deletion outside of the folder action sidebar
    // this.folder_id = null;
    this.parent_folder_id = null;
    this.currentFolderId = '';
    this.currentFolderId = '';
    this.folder_size = 0;
    // Close any open components
    this.files_action_sidebar_container = false;
    this.files_action_container = false
    this.file_edit_mode = false;
    this.file_action_status_menu = false;
    this.more_info_dropdown = false;
    this.folder_action_container = false;
    this.folders_action_sidebar_container = false;
    this.folder_edit_mode = false;
    this.getStorageDetails();
    if (this.openFolders.length < 0) {
      this.getFiles();
    }
  }

  clearFolderSelection() {
    this.folderIndex = [];
    this.openFolders = [];
    this.filteredFiles = [];
    this.filteredFolders = [];
    this.getFiles();
    this.getFolders();
    this.loading = true;
  }

  // Storage

  calculateStoragePercentage(): string {
    if (this.total_storage === 0) {
      return '0';
    }
    const percentage = (this.used_storage / this.total_storage) * 100;
    return percentage.toFixed(2);
  }

  // Manually converted storage values
  getTotalStorage(): string {
    this.total_storage = 100000000; // Manually entered value for testing
    if (this.total_storage === 100000000) {
      return '100 MB';
    } else if (this.total_storage === 5000000000) {
      return '5 GB';
    } else {
      return this.convertFileSize(this.total_storage);
    }
  }

  getUsedStorage(): void {
    this.fileService.getUsedStorage(this.currentWorkspaceId).subscribe({
      next: (response: any) => {
        if (response.sum === null) {
          this.used_storage = 0;
          return;
        } else {
          this.used_storage = response.sum;
        }
      },
      error: (err: any) => {
        console.error('Failed to get used storage', err);
      }
    });
  }

  getStorageDetails(): void {
    this.getTotalStorage();
    this.getUsedStorage();
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
            // clear folder index
            this.clearFolderSelection();
            this.getStorageDetails();
          });
        }
      });
    } else {
      console.log('Not a workspace path');
    }
  }
}