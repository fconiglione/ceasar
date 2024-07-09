import { Component, ElementRef } from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faEllipsisVertical, faCircleInfo, faArrowRightLong, faTrash,
  faUpRightFromSquare, faPen, faChevronDown
 } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { WorkspaceService } from '../../services/workspace/workspace.service';
import { AsyncPipe, NgFor, NgIf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from '../../components/loading/loading.component';
import { AuthService } from '@auth0/auth0-angular';

export class workspace {
  workspace_id: string | undefined;
  title: string | undefined;
  description: string | undefined;
  has_leads: boolean | undefined;
  has_accounts: boolean | undefined;
  has_opportunities: boolean | undefined;
  has_contacts: boolean | undefined;
  has_files: boolean | undefined;
  has_reports: boolean | undefined;
  creation_date: string | undefined;
  last_opened_date: string | undefined;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FaIconComponent,
    NgFor,
    NgIf,
    FormsModule,
    DatePipe, LoadingComponent,
    AsyncPipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  // User variables
  user: any;
  sub: string | undefined;
  nickname: string | undefined;
  name: string | undefined;
  picture: string | undefined;
  updated_at: string | undefined;

  WORKSPACE: any;
  workspace_id: string | undefined;
  title: string | undefined;
  description: string | undefined;
  has_leads: boolean | undefined;
  has_accounts: boolean | undefined;
  has_opportunities: boolean | undefined;
  has_contacts: boolean | undefined;
  has_files: boolean | undefined;
  has_reports: boolean | undefined;
  creation_date: string | undefined;
  last_opened_date: string | undefined;

  faArrowRightLong = faArrowRightLong;
  BlankWorkspace = "assets/images/blank-workspace-img.png";
  CeasarColouredLogo2 = "assets/images/ceasar-coloured-logo-2.svg";
  faEllipsisVertical = faEllipsisVertical;
  faPlus = faPlus;
  faCircleInfo = faCircleInfo;
  faTrash = faTrash;
  faUpRightFromSquare = faUpRightFromSquare;
  faPen = faPen;
  faChevronDown = faChevronDown;
  loading: boolean = true;
  ShapesBanner = "assets/images/shapes-banner.svg";
  activeFilter: string = '';
  workspaceSortFilterSelector: boolean = false;

  constructor(private elementRef: ElementRef, private workspaceService: WorkspaceService, public authService: AuthService ) {}

  openCreateWorkspace() {
    const createWorkspacePopUp = this.elementRef.nativeElement.querySelector('#create-workspace-pop-up');
    createWorkspacePopUp.style.display = 'block';
  }
  openEditWorkspace(workspace: any) {
    this.workspace_id = workspace.workspace_id;
    this.title = workspace.title;
    const editWorkspacePopUp = this.elementRef.nativeElement.querySelector('#edit-workspace-pop-up');
    editWorkspacePopUp.style.display = 'block';
  }
  closeCreateWorkspace() {
    const createWorkspacePopUp = this.elementRef.nativeElement.querySelector('#create-workspace-pop-up');
    createWorkspacePopUp.style.display = 'none';
  }
  closeEditWorkspace() {
    const editWorkspacePopUp = this.elementRef.nativeElement.querySelector('#edit-workspace-pop-up');
    editWorkspacePopUp.style.display = 'none';
  }
  saveWorkspace(workspace_id : any, title: any) {
        this.workspaceService.updateWorkspace(this.sub, workspace_id, title).subscribe(response => {
          this.getWorkspaces();
          this.closeEditWorkspace();
        });
  }
  openWorkspaceSubSetting(workspace : any) {
    this.WORKSPACE.forEach((ws: any) => {
      if (ws !== workspace) {
        ws.showSubSetting = false;
      }
    });
    workspace.showSubSetting = !workspace.showSubSetting;
  }

  onReset() {
    this.title = '';
    this.description = '';
    this.has_leads = false;
    this.has_accounts = false;
    this.has_opportunities = false;
    this.has_contacts = false;
    this.has_files = false;
    this.has_reports = false;
  }

  getWorkspaces(): void {
    this.workspaceService.getWorkspaces(this.sub).subscribe(response => {
      this.WORKSPACE = response;
      this.sortWorkspaces('last_opened_date');
      this.loading = false;
    });
  }

  openWorkspaceSortFilterSelector() {
    this.workspaceSortFilterSelector = !this.workspaceSortFilterSelector;
    if (this.workspaceSortFilterSelector) {
      const workspaceSortFilterSelector = this.elementRef.nativeElement.querySelector('.workspace-filter-selector');
      workspaceSortFilterSelector.style.display = 'flex';
    }
    else {
      this.closeWorkspaceSortFilterSelector();
    }
  }

  closeWorkspaceSortFilterSelector() {
    const workspaceSortFilterSelector = this.elementRef.nativeElement.querySelector('.workspace-filter-selector');
    workspaceSortFilterSelector.style.display = 'none';
  }

  sortWorkspaces(sortFactor: any): void {
    if (sortFactor === 'last_opened_date') {
      this.activeFilter = 'Last opened';
      this.WORKSPACE.sort((a: workspace, b: workspace) => {
        const dateA = new Date(a.last_opened_date || '1970-01-01');
        const dateB = new Date(b.last_opened_date || '1970-01-01');
        
        return dateB.getTime() - dateA.getTime();
      });
    }
    if (sortFactor === 'creation_date') {
      this.activeFilter = 'Creation date';
      this.WORKSPACE.sort((a: workspace, b: workspace) => {
        const dateA = new Date(a.creation_date || '1970-01-01');
        const dateB = new Date(b.creation_date || '1970-01-01');
        
        return dateB.getTime() - dateA.getTime();
      });
    }
    if (sortFactor === 'title') {
      this.activeFilter = 'Name';
      this.WORKSPACE.sort((a: workspace, b: workspace) => {
        const titleA = a.title || '';
        const titleB = b.title || '';
        
        return titleA.localeCompare(titleB);
      });
    }
  }

  createWorkspace(): void {
    let newWorkspace = {
      title: this.title,
      description: this.description,
      has_leads: this.has_leads,
      has_accounts: this.has_accounts,
      has_opportunities: this.has_opportunities,
      has_contacts: this.has_contacts,
      has_files: this.has_files,
      has_reports: this.has_reports,
      creation_date: new Date().toISOString().split('T')[0]
    };

      this.workspaceService.addWorkspace(this.sub, newWorkspace).subscribe(response => {
        this.getWorkspaces();
        this.closeCreateWorkspace();
        this.onReset();
      });
  }

  deleteWorkspace(workspace: any): void {
    if (confirm('Are you sure you want to delete this workspace?')) {
        this.workspaceService.deleteWorkspace(this.sub, workspace.workspace_id).subscribe(response => {
          this.getWorkspaces();
        });
    }
  }

  ngOnInit() {
    this.getWorkspaces();
  }
}