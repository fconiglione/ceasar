import { Component, ElementRef } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faChevronDown, faSearch, faDownload, faPhone, faEnvelope, faEllipsisV, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
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

  newLeadsCount: number = 0;
  contactedLeadsCount: number = 0;
  inProcessLeadsCount: number = 0;
  closedLeadsCount: number = 0;

  ShapesBanner = "assets/images/shapes-banner.svg";
  faChevronDown = faChevronDown;
  faSearch = faSearch;
  faDownload = faDownload;
  faPhone = faPhone;
  faEnvelope = faEnvelope;
  faEllipsisV = faEllipsisV;
  faCircleInfo = faCircleInfo;
  DefaultPFP = "assets/images/default-pfp.svg";  ;

  constructor( private leadService: LeadService, private route: ActivatedRoute, private router: Router, private elementRef: ElementRef ) { }

  getLeads(): void {
    // Get leads from the API
    this.leadService.getLeads(this.currentWorkspaceId).subscribe(response => {
      this.LEAD = response;
      this.countLeads();
      this.loading = false;
    });
  }

  countLeads(): void {
    // Count the number of leads in each status
    this.newLeadsCount = this.LEAD.filter((lead: any) => lead.status_id === 1).length;
    this.contactedLeadsCount = this.LEAD.filter((lead: any) => lead.status_id === 2).length;
    this.inProcessLeadsCount = this.LEAD.filter((lead: any) => lead.status_id === 3).length;
    this.closedLeadsCount = this.LEAD.filter((lead: any) => lead.status_id === 4).length;
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

  openNewLeadPopup(): void {
    // Open the new lead popup
    const newLeadPopup = this.elementRef.nativeElement.querySelector('.create-lead-pop-up');
    newLeadPopup.style.display = 'block';
  }

  closeNewLeadPopup(): void {
    // Close the new lead popup
    const newLeadPopup = this.elementRef.nativeElement.querySelector('.create-lead-pop-up');
    newLeadPopup.style.display = 'none';
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
