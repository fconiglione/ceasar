import { Component } from '@angular/core';
import { WorkspaceService } from '../../services/workspace/workspace.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FeatureService } from '../../services/feature/feature.service';
import { NgIf } from '@angular/common';
import { LeadsComponent } from '../../components/features/leads/leads.component';
import { ContactsComponent } from '../../components/features/contacts/contacts.component';
import { AccountsComponent } from '../../components/features/accounts/accounts.component';
import { OpportunitiesComponent } from '../../components/features/opportunities/opportunities.component';
import { FilesComponent } from '../../components/features/files/files.component';
import { ReportsComponent } from '../../components/features/reports/reports.component';
import { HomeComponent } from '../../components/features/home/home.component';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [
    NgIf, LeadsComponent,
    ContactsComponent, AccountsComponent,
    OpportunitiesComponent, FilesComponent,
    ReportsComponent, HomeComponent
  ],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.css'
})
export class WorkspaceComponent {
  sub: string | undefined;

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

  constructor( private workspaceService : WorkspaceService, private route: ActivatedRoute, private router: Router, public featureService: FeatureService, public authService: AuthService ) {}

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
    this.workspaceService.updateLastOpenedDate(this.sub, this.currentWorkspaceId, this.last_opened_date).subscribe(response => {
      console.log(response);
    });
  }

  isWorkspacePath(): boolean {
    return this.router.url.startsWith('/ws');
  }

  ngOnInit(): void {
    if (this.isWorkspacePath()) {
      this.route.queryParams.subscribe(params => {
        this.authService.user$.subscribe(user => {
          if (user && user.sub) {
            this.sub = user.sub;
            this.currentWorkspaceId = params['workspace_id'] || '';
            this.updateLastOpenedDate();
          }
        });
      });
    } else {
      console.log('Not a workspace path');
      // this.getWorkspaces();
    }
  }

}