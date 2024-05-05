import { Component, ElementRef } from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faEllipsisVertical, faCircleInfo, faArrowRightLong, faTrash,
  faUpRightFromSquare, faPen
 } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { WorkspaceService } from '../../services/workspace/workspace.service';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/search/search.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    FaIconComponent,
    NgFor,
    NgIf,
    FormsModule,
    DatePipe
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})

export class SearchComponent {
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
  tokenVerified: boolean = false;
  loading: boolean = true;
  ShapesBanner = "assets/images/shapes-banner.svg";
  searchTerm = '';

  constructor(private elementRef: ElementRef, private workspaceService: WorkspaceService, private searchService: SearchService, private route: ActivatedRoute) {}

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
    this.workspaceService.updateWorkspace(workspace_id, title).subscribe(response => {
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

    if (this.searchTerm) {
      // Send the api request to search
      this.searchService.search(this.searchTerm).subscribe(response => {
        this.WORKSPACE = response;
          this.loading = false;
      });
    } else if (this.searchTerm.length === 0) {
      console.error('Search input is empty');
      window.location.href = '/';
    } else {
      console.error('Search input is invalid');
      window.location.href = `/search?q=${this.searchTerm}`;
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

    this.workspaceService.addWorkspace(newWorkspace).subscribe(response => {
      this.getWorkspaces();
      this.closeCreateWorkspace();
      this.onReset();
    });
  }

  deleteWorkspace(workspace: any): void {
    if (confirm('Are you sure you want to delete this workspace?')) {
      this.workspaceService.deleteWorkspace(workspace.workspace_id).subscribe(response => {
        this.getWorkspaces();
      });
    }
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['q'] || '';
      this.getWorkspaces();
    });
  }
}

