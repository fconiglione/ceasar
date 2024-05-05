import { Component } from '@angular/core';
import { WorkspaceService } from '../../services/workspace/workspace.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [],
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

  // Features
  home: boolean = false;

  constructor( private workspaceService : WorkspaceService, private route: ActivatedRoute, private router: Router ) {}

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
        this.home = true;
        this.currentWorkspaceId = params['workspace_id'] || '';
        this.updateLastOpenedDate();
      });
    } else {
      console.log('Not a workspace path');
      // this.getWorkspaces();
    }
  }

}