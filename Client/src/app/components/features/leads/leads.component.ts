import { Component, ElementRef } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faChevronDown, faSearch, faDownload, faPhone, faEnvelope, faEllipsisV, faCircleInfo, faEye, faEdit, faTrash, faArrowLeft, faSort, faBars, faTableCells, faUserAlt, faArrowRightToBracket, faXmark, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { LeadService } from '../../../services/lead/lead.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from '../../loading/loading.component';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [
    FaIconComponent,
    NgFor,
    NgIf,
    DatePipe,
    CommonModule,
    FormsModule,
    LoadingComponent
  ],
  templateUrl: './leads.component.html',
  styleUrl: './leads.component.css'
})
export class LeadsComponent {
  // User components
  username: string | undefined;

  // Lead components
  LEAD: any;
  sub: string | undefined;
  lead_id: string | undefined;
  workspace_id: string | undefined;
  title: string | undefined;
  first_name: string | undefined;
  last_name: string | undefined;
  lead_status_id: string | undefined;
  photo_url: string | undefined;
  company: string | undefined;
  phone_number: string | undefined;
  email: string | undefined;
  source: string | undefined;
  created_at: string | undefined;
  updated_at: string | undefined;

  // Component actions
  leads_action_container: boolean = false;
  leads_action_sidebar_container: boolean = true;
  loading: boolean = true;

  // Other variables
  lead_status: string | undefined;
  lead_count: number = 0;
  lead_status_new_count: number = 0;
  lead_status_contacted_count: number = 0;
  lead_status_qualified_count: number = 0;
  lead_status_closed_won_count: number = 0;
  lead_status_closed_lost_count: number = 0;
  previous_status_filter: number = 0;
  active_status_filter: number = 0;

  // Font Awesome icons
  faChevronDown = faChevronDown;
  faSearch = faSearch;
  faDownload = faDownload;
  faPhone = faPhone;
  faEnvelope = faEnvelope;
  faEllipsisV = faEllipsisV;
  faCircleInfo = faCircleInfo;
  faEye = faEye;
  faEdit = faEdit;
  faTrash = faTrash;
  faArrowLeft = faArrowLeft;
  faUserAlt = faUserAlt;
  faSort = faSort;
  faBars = faBars;
  faTableCells = faTableCells;
  faArrowRightToBracket = faArrowRightToBracket;
  faXmark = faXmark;
  faPenToSquare = faPenToSquare;

  currentWorkspaceId: string | undefined;

  leadSearchInputValue: string = '';
  activeStatusFilter: string = 'All status';

  ShapesBanner = "assets/images/shapes-banner.svg";
  DefaultPFP = "assets/images/default-pfp.svg";

  constructor( private leadService: LeadService, private route: ActivatedRoute, private router: Router, private elementRef: ElementRef, private authService: AuthService ) { }

  getLeads(): void {
    // Get leads from the API
    this.leadService.getLeads(this.currentWorkspaceId).subscribe(response => {
      this.LEAD = response;
      this.countLeads();
      this.loading = false;
    });
  }

  createLead(): void {
    let newLead = {
      sub  : this.sub,
      workspace_id : this.currentWorkspaceId,
      title : this.title,
      first_name: this.first_name,
      last_name: this.last_name,
      company: this.company,
      phone_number: this.phone_number,
      email: this.email,
      lead_status_id: this.lead_status_id,
      photo_url: this.photo_url,
      source: this.source,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.leadService.createLead(newLead).subscribe(response => {
      console.log(response);
      this.getLeads();
      this.onReset();
      this.leads_action_container = false;
    });
  }

  getLeadStatus(lead_status_id: any) {
    switch (lead_status_id) {
      case 1:
        return 'New';
      case 2:
        return 'Contacted';
      case 3:
        return 'Qualified';
      case 4:
        return 'Closed-Won';
      case 5:
        return 'Closed-Lost';
      default:
        return 'Not provided';
    }
  }

  getLeadStatusClasses(lead_status_id: any) {
    switch (lead_status_id) {
      case 1:
        return { 'lead-status': true, 'new': true };
      case 2:
        return { 'lead-status': true, 'contacted': true };
      case 3:
        return { 'lead-status': true, 'qualified': true };
      case 4:
        return { 'lead-status': true, 'closed-won': true };
      case 5:
        return { 'lead-status': true, 'closed-lost': true };
      default:
        return { 'lead-status': true, 'not-provided': true };
    }
  }

  onInputChange(event: any) {
    const searchInputValue = event.target.value.trim();
    this.leadSearchInputValue = searchInputValue;
  
    if (this.leadSearchInputValue === '') {
      this.getLeads();
    } else {
      this.countLeads();
      this.LEAD = this.LEAD.filter((lead: any) => {
        const title = lead.title?.toLowerCase() ?? '';
        const firstName = lead.first_name?.toLowerCase() ?? '';
        const lastName = lead.last_name?.toLowerCase() ?? '';
        const company = lead.company?.toLowerCase() ?? '';
        const phoneNumber = lead.phone_number?.toLowerCase() ?? '';
        const email = lead.email?.toLowerCase() ?? '';
        // const status = this.getStatus(lead.status_id).toLowerCase();
  
        return title.includes(this.leadSearchInputValue.toLowerCase()) ||
          firstName.includes(this.leadSearchInputValue.toLowerCase()) ||
          lastName.includes(this.leadSearchInputValue.toLowerCase()) ||
          company.includes(this.leadSearchInputValue.toLowerCase()) ||
          phoneNumber.includes(this.leadSearchInputValue.toLowerCase()) ||
          email.includes(this.leadSearchInputValue.toLowerCase()) ||
          status.includes(this.leadSearchInputValue.toLowerCase());
      });
    }
  }  

  countLeads(): void {
    this.lead_count = this.LEAD.length;
    this.lead_status_new_count = this.LEAD.filter((lead: any) => lead.lead_status_id === 1).length;
    this.lead_status_contacted_count = this.LEAD.filter((lead: any) => lead.lead_status_id === 2).length;
    this.lead_status_qualified_count = this.LEAD.filter((lead: any) => lead.lead_status_id === 3).length;
    this.lead_status_closed_won_count = this.LEAD.filter((lead: any) => lead.lead_status_id === 4 || lead.lead_status_id === 5).length;
    this.lead_status_closed_lost_count = this.LEAD.filter((lead: any) => lead.lead_status_id === 5).length;
  } 
  
  filterLeadStatus(lead_status_id: number): void {
      this.active_status_filter = lead_status_id;
      if (lead_status_id === this.previous_status_filter) {
          this.getLeads();
          this.previous_status_filter = 0;
      } else {
          if (lead_status_id === 0) {
            this.getLeads();
          } else {
              this.leadService.getLeads(this.currentWorkspaceId).subscribe(response => {
                  this.LEAD = response;
                  this.countLeads();
                  this.LEAD = this.LEAD.filter((lead: any) => lead.lead_status_id === lead_status_id);
                  this.previous_status_filter = lead_status_id;
                  this.activeStatusFilter = this.getLeadStatus(lead_status_id);
              });
          }
      }
  }



  // // CSV Exporting

  // generateCSV(): string {
  //   let csv = 'Last Name,First Name,Company,Phone Number,Email,Status\n';

  //   this.LEAD.forEach((lead: any) => {
  //     const row = `${lead.last_name || ''},${lead.first_name || ''},${lead.company || ''},${lead.phone_number || ''},${lead.email || ''},${this.getStatus(lead.status_id.toString())}\n`;
  //     csv += row;
  //   });

  //   return csv;
  // }

  // downloadCSV(): void {
  //   const csvData = this.generateCSV();
  //   const blob = new Blob([csvData], { type: 'text/csv' });
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = 'leads.csv';
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  //   window.URL.revokeObjectURL(url);
  // }

  // toggleLeadCardDropdown(lead: any): void {
  //   this.LEAD.forEach((l: any) => {
  //     if (l !== lead) {
  //       l.showSubSetting = false;
  //     }
  //   });
  //   lead.showSubSetting = !lead.showSubSetting;
  // }

  // deleteLead(lead: any): void {
  //   if (confirm('Are you sure you want to delete this lead?')) {
  //     this.leadService.deleteLead(lead.lead_id).subscribe(response => {
  //       this.getLeads();
  //     });
  //   }
  // }

  // closeLeadDetailsPopUp(): void {
  //   const leadDetailsPopUp = this.elementRef.nativeElement.querySelector('.lead-details-pop-up');
  //   leadDetailsPopUp.style.display = 'none';

  //   this.lead_id = undefined;
  //   this.first_name = undefined;
  //   this.last_name = undefined;
  //   this.company = undefined;
  //   this.phone_number = undefined;
  //   this.email = undefined;
  //   this.status = undefined;
  //   this.status_id = undefined;
  //   this.description = undefined;
  //   this.full_name = undefined;

  //   this.leadsEditMode = false;
  // }

  // openLeadDetailsPopUp(lead: any): void {
  //   this.lead_id = lead.lead_id;
  //   this.first_name = lead.first_name;
  //   this.last_name = lead.last_name;
  //   this.full_name = `${lead.first_name} ${lead.last_name}`;
  //   this.company = lead.company;
  //   this.phone_number = lead.phone_number;
  //   this.email = lead.email;
  //   this.status = this.getStatus(lead.status_id);
  //   this.status_id = lead.status_id;
  //   this.description = lead.description;

  //   const leadDetailsPopUp = this.elementRef.nativeElement.querySelector('.lead-details-pop-up');
  //   leadDetailsPopUp.style.display = 'block';
  // }

  // updateLead(): void {
  //   let updatedLead = {
  //     lead_id: this.lead_id,
  //     full_name: this.full_name,
  //     company: this.company,
  //     phone_number: this.phone_number,
  //     email: this.email,
  //     status_id: this.status_id,
  //     description: this.description
  //   };

  //   this.leadService.updateLead(updatedLead).subscribe(response => {
  //     console.log(response);
  //     this.getLeads();
  //     this.closeLeadDetailsPopUp();
  //   });
  // }

  // leadsEditMode: boolean = false;

  // toggleLeadsEditMode(): void {
  //   this.leadsEditMode = !this.leadsEditMode;
  // }

  onReset(): void {
    // Reset the new lead form
    this.title = '';
    this.first_name = '';
    this.last_name = '';
    this.company = '';
    this.phone_number = '';
    this.email = '';
    this.lead_status_id = '';
    this.photo_url = '';
    this.source = '';
    this.created_at = '';
    this.updated_at = '';
  }

  isWorkspacePath(): boolean {
    return this.router.url.startsWith('/ws');
  }

  ngOnInit() {
    if (this.isWorkspacePath()) {
      this.authService.user$.subscribe(user => {
        if (user && user.sub) {
          this.sub = user.sub;
          this.username = user.nickname;
          this.route.queryParams.subscribe(params => {
            this.currentWorkspaceId = params['workspace_id'] || '';
            this.getLeads();
          });
        }
      });
    } else {
      console.log('Not a workspace path');
    }
  }
}
