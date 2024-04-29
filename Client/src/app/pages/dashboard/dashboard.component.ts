import { Component, ElementRef } from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faEllipsisVertical, faCircleInfo, faArrowRightLong } from '@fortawesome/free-solid-svg-icons';
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
  tokenVerified: boolean = false;

  constructor(private elementRef: ElementRef, private workspaceService: WorkspaceService) {}

  openCreateWorkspace() {
    const createWorkspacePopUp = this.elementRef.nativeElement.querySelector('#create-workspace-pop-up');
    createWorkspacePopUp.style.display = 'block';
  }
  closeCreateWorkspace() {
    const createWorkspacePopUp = this.elementRef.nativeElement.querySelector('#create-workspace-pop-up');
    createWorkspacePopUp.style.display = 'none';
  }

  getWorkspaces(): void {
    this.workspaceService.getWorkspaces().subscribe(response => {
      this.WORKSPACE = response;
    });
  }

  ngOnInit() {
    this.getWorkspaces();
  }
}
