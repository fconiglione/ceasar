import { Component, ElementRef } from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faEllipsisVertical, faCircleInfo, faArrowRightLong, faTrash,
  faUpRightFromSquare, faPen
 } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { WorkspaceService } from '../../services/workspace/workspace.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FaIconComponent,
    NgFor,
    NgIf,
    FormsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
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

  constructor(private elementRef: ElementRef, private workspaceService: WorkspaceService) {}

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

  getWorkspaces(): void {
    this.workspaceService.getWorkspaces().subscribe(response => {
      this.WORKSPACE = response;
    });
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
      has_reports: this.has_reports
    };

    this.workspaceService.addWorkspace(newWorkspace).subscribe(response => {
      this.getWorkspaces();
      this.closeCreateWorkspace();
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
    this.getWorkspaces();
  }
}
