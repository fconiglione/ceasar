import { Component } from '@angular/core';
import { WorkspaceService } from '../../services/workspace/workspace.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FeatureService } from '../../services/feature/feature.service';
import { NgIf } from '@angular/common';
import { LeadsComponent } from '../../components/features/leads/leads.component';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [
    NgIf, LeadsComponent
  ],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.css'
})
export class WorkspaceComponent {
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
  currentWorkspaceId: string | undefined;

  constructor( private workspaceService : WorkspaceService, private route: ActivatedRoute, private router: Router, public featureService: FeatureService ) {}

  // Declare feature variables
  home: boolean = false;
  leads: boolean = false;
  accounts: boolean = false;
  opportunities: boolean = false;
  contacts: boolean = false;
  files: boolean = false;
  reports: boolean = false;

  setFeatureValues() {
    // Retrieve feature values from the FeatureService
    this.home = this.featureService.home;
    this.leads = this.featureService.leads;
    this.accounts = this.featureService.accounts;
    this.opportunities = this.featureService.opportunities;
    this.contacts = this.featureService.contacts;
    this.files = this.featureService.files;
    this.reports = this.featureService.reports;
  }

  updateLastOpenedDate() {
    this.last_opened_date = new Date().toISOString();
    this.workspaceService.updateLastOpenedDate(this.currentWorkspaceId, this.last_opened_date).subscribe(response => {
      console.log(response);
    });
  }

  isWorkspacePath(): boolean {
    return this.router.url.startsWith('/ws');
  }

  ngOnInit(): void {
    if (this.isWorkspacePath()) {
      this.route.queryParams.subscribe(params => {
        this.currentWorkspaceId = params['workspace_id'] || '';
        this.updateLastOpenedDate();
      });
    } else {
      console.log('Not a workspace path');
      // this.getWorkspaces();
    }
  }

}