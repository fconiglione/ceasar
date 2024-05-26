import { Component } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faChevronDown, faSearch, faDownload, faPhone, faEnvelope, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { LeadService } from '../../../services/lead/lead.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [
    FaIconComponent,
    NgFor,
    NgIf,
    DatePipe,
    CommonModule
  ],
  templateUrl: './leads.component.html',
  styleUrl: './leads.component.css'
})
export class LeadsComponent {
  // Lead card variables
  LEAD: any;
  first_name: string | undefined;
  last_name: string | undefined;
  company: string | undefined;
  phone_number: string | undefined;
  email: string | undefined;
  status: string | undefined;
  status_id: string | undefined;
  loading: boolean = true;
  currentWorkspaceId: string | undefined;

  ShapesBanner = "assets/images/shapes-banner.svg";
  faChevronDown = faChevronDown;
  faSearch = faSearch;
  faDownload = faDownload;
  faPhone = faPhone;
  faEnvelope = faEnvelope;
  faEllipsisV = faEllipsisV;
  DefaultPFP = "assets/images/default-pfp.svg";  ;

  constructor( private leadService: LeadService, private route: ActivatedRoute, private router: Router ) { }

  getLeads(): void {
    // Get leads from the API
    this.leadService.getLeads(this.currentWorkspaceId).subscribe(response => {
      this.LEAD = response;
      // this.sortWorkspaces('last_opened_date');
      this.loading = false;
    });
  }

  getStatus(statusId: string): string {
    switch (statusId) {
      case '1':
        return 'New';
      case '2':
        return 'Contacted';
      case '3':
        return 'In-Process';
      case '4':
        return 'Closed';
      default:
        return 'Unassigned';
    }
  }

  getStatusClasses(statusId: string): any {
    switch (statusId) {
      case '1':
        return { 'status': true, 'new': true };
      case '2':
        return { 'status': true, 'contacted': true };
      case '3':
        return { 'status': true, 'in-process': true };
      case '4':
        return { 'status': true, 'closed': true };
      default:
        return { 'status': true, 'unassigned': true };
    }
  }

  isWorkspacePath(): boolean {
    return this.router.url.startsWith('/ws');
  }

  ngOnInit() {
    if (this.isWorkspacePath()) {
      this.route.queryParams.subscribe(params => {
        this.currentWorkspaceId = params['workspace_id'] || '';
        this.getLeads();
      });
    } else {
      console.log('Not a workspace path');
    }
  }
}
