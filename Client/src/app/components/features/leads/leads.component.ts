import { Component, ElementRef } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faChevronDown, faSearch, faDownload, faPhone, faEnvelope, faEllipsisV, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { LeadService } from '../../../services/lead/lead.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [
    FaIconComponent,
    NgFor,
    NgIf,
    DatePipe,
    CommonModule,
    FormsModule
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
  description: string | undefined;
  loading: boolean = true;
  currentWorkspaceId: string | undefined;

  full_name: string | undefined;

  leadSearchInputValue: string = '';

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
    this.onReset();
  }

  createLead(): void {
    let newLead = {
      full_name: this.full_name,
      company: this.company,
      phone_number: this.phone_number,
      email: this.email,
      status_id: this.status_id,
      description: this.description,
      workspace_id: this.currentWorkspaceId
    };

    this.leadService.createLead(newLead).subscribe(response => {
      console.log(response);
      this.getLeads();
      this.closeNewLeadPopup();
    });
  }

  onInputChange(event: any) {
    const searchInputValue = event.target.value.trim();
    this.leadSearchInputValue = searchInputValue;
  
    if (this.leadSearchInputValue === '') {
      this.getLeads();
    } else {
      this.LEAD = this.LEAD.filter((lead: any) => {
        const firstName = lead.first_name?.toLowerCase() ?? '';
        const lastName = lead.last_name?.toLowerCase() ?? '';
        const company = lead.company?.toLowerCase() ?? '';
        const phoneNumber = lead.phone_number?.toLowerCase() ?? '';
        const email = lead.email?.toLowerCase() ?? '';
        const status = this.getStatus(lead.status_id).toLowerCase();
  
        return firstName.includes(this.leadSearchInputValue.toLowerCase()) ||
          lastName.includes(this.leadSearchInputValue.toLowerCase()) ||
          company.includes(this.leadSearchInputValue.toLowerCase()) ||
          phoneNumber.includes(this.leadSearchInputValue.toLowerCase()) ||
          email.includes(this.leadSearchInputValue.toLowerCase()) ||
          status.includes(this.leadSearchInputValue.toLowerCase());
      });
    }
  }  
  
  onReset(): void {
    // Reset the new lead form
    this.full_name = '';
    this.company = '';
    this.phone_number = '';
    this.email = '';
    this.status_id = undefined;
    this.description = '';
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
