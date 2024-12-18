import { Component, ElementRef } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faChevronDown, faSearch, faDownload, faPhone, faEnvelope, faEllipsisV, faCircleInfo, faEye, faEdit, faTrash, faArrowLeft, faSort, faBars, faTableCells, faUserAlt, faArrowRightToBracket, faXmark, faPenToSquare, faSquare } from '@fortawesome/free-solid-svg-icons';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { LeadService } from '../../../services/lead/lead.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from '../../loading/loading.component';
import { AuthService } from '@auth0/auth0-angular';
import { NoDataComponent } from "../../no-data/no-data.component";

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
    LoadingComponent,
    NoDataComponent
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
  title: string | undefined = "";
  first_name: string | undefined;
  last_name: string | undefined;
  lead_status_id: string | undefined = "";
  photo_url: string | undefined;
  company: string | undefined;
  phone_number: string | undefined;
  email: string | undefined;
  source: string | undefined;
  created_at: string | undefined;
  updated_at: string | undefined;

  // Component actions
  leads_action_container: boolean = false;
  leads_action_sidebar_container: boolean = false;
  lead_edit_mode: boolean = false;
  loading: boolean = true;
  more_info_dropdown: boolean = false;
  card_view: boolean = true;
  list_view: boolean = false;
  sort_by_dropdown: boolean = false;
  lead_action_status_menu: boolean = false;

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
  active_sort_factor: string = 'By Last Name';
  allLeads: any[] = [];  // This should be initialized with the complete list of leads
  filteredLeads: any[] = [];

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
  faSquare = faSquare;

  currentWorkspaceId: string | undefined;

  leadSearchInputValue: string = '';
  activeStatusFilter: string = 'All status';

  ShapesBanner = "assets/images/shapes-banner.svg";
  DefaultPFP = "assets/images/default-pfp.svg";

  constructor( private leadService: LeadService, private route: ActivatedRoute, private router: Router, private elementRef: ElementRef, private authService: AuthService ) { }

  getLeads(): void {
    // Get leads from the API
    this.leadService.getLeads(this.currentWorkspaceId).subscribe((leads: any) => {
      // this.filteredLeads = response;
      this.allLeads = leads;
      this.filteredLeads = leads;
      this.countLeads();
      this.sortLeads('last_name'); // Sort by last name by default
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
    });
  }

  updateLead(): void {
    if (confirm('Are you sure you want to make changes to this lead? All changes are final and cannot be undone.')) {
      let updatedLead = {
        lead_id: this.lead_id,
        title: this.title,
        first_name: this.first_name,
        last_name: this.last_name,
        company: this.company,
        phone_number: this.phone_number,
        email: this.email,
        lead_status_id: this.lead_status_id,
        photo_url: this.photo_url,
        source: this.source,
        updated_at: new Date().toISOString(),
        workspace_id: this.currentWorkspaceId
      };

      this.leadService.updateLead(updatedLead).subscribe(response => {
        console.log(response);
        this.getLeads();
        this.onReset();
      });
    }
  }

  deleteLead(): void {
    if (confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
      this.leadService.deleteLead(this.lead_id).subscribe(response => {
        console.log(response);
        this.getLeads();
        this.onReset();
      });
    }
  }

  // Deletion from directly within the list
  deleteLeadById(lead_id: string): void {
    if (confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
      this.leadService.deleteLead(lead_id).subscribe(response => {
        console.log(response);
        this.getLeads();
      });
    }
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
    const searchInputValue = event.target.value.trim().toLowerCase();
    this.leadSearchInputValue = searchInputValue;
  
    if (this.leadSearchInputValue.length > 0) {
      this.countLeads();
      this.filteredLeads = this.allLeads.filter((lead: any) => {
        const title = lead.title?.toLowerCase() ?? '';
        const firstName = lead.first_name?.toLowerCase() ?? '';
        const lastName = lead.last_name?.toLowerCase() ?? '';
        const company = lead.company?.toLowerCase() ?? '';
        const phoneNumber = lead.phone_number?.toLowerCase() ?? '';
        const email = lead.email?.toLowerCase() ?? '';
        const status = this.getLeadStatus(lead.lead_status_id).toLowerCase();
  
        return title.includes(this.leadSearchInputValue) ||
          firstName.includes(this.leadSearchInputValue) ||
          lastName.includes(this.leadSearchInputValue) ||
          company.includes(this.leadSearchInputValue) ||
          phoneNumber.includes(this.leadSearchInputValue) ||
          email.includes(this.leadSearchInputValue) ||
          status.includes(this.leadSearchInputValue);
      });
    } else {
      this.countLeads();
      this.filteredLeads = this.allLeads;
    }
  }

  countLeads(): void {
    this.lead_count = this.filteredLeads.length;
    this.lead_status_new_count = this.filteredLeads.filter((lead: any) => lead.lead_status_id === 1).length;
    this.lead_status_contacted_count = this.filteredLeads.filter((lead: any) => lead.lead_status_id === 2).length;
    this.lead_status_qualified_count = this.filteredLeads.filter((lead: any) => lead.lead_status_id === 3).length;
    this.lead_status_closed_won_count = this.filteredLeads.filter((lead: any) => lead.lead_status_id === 4).length;
    this.lead_status_closed_lost_count = this.filteredLeads.filter((lead: any) => lead.lead_status_id === 5).length;
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
                  this.filteredLeads = response as any[];
                  this.countLeads();
                  this.filteredLeads = this.filteredLeads.filter((lead: any) => lead.lead_status_id === lead_status_id);
                  this.previous_status_filter = lead_status_id;
                  this.activeStatusFilter = this.getLeadStatus(lead_status_id);
              });
          }
      }
  }

  openLeadsActionSidebar(lead: any): void {
    // Setting the lead details
    this.lead_id = lead.lead_id;
    this.title = lead.title;
    this.first_name = lead.first_name;
    this.last_name = lead.last_name;
    this.company = lead.company;
    this.phone_number = lead.phone_number;
    this.email = lead.email;
    this.lead_status_id = lead.lead_status_id;
    this.photo_url = lead.photo_url;
    this.source = lead.source;
    this.created_at = lead.created_at;
    this.updated_at = lead.updated_at
    // Opening the leads action sidebar
    // this.onReset();
    this.leads_action_sidebar_container = true;
  }

  openLeadStatusMenu(lead: any): void {
    this.lead_status_id = lead.lead_status_id;
    this.lead_id = lead.lead_id;
    this.first_name = lead.first_name;
    this.last_name = lead.last_name;
    this.title = lead.title;
    this.company = lead.company;
    this.phone_number = lead.phone_number;
    this.email = lead.email;
    this.photo_url = lead.photo_url;
    this.source = lead.source;
    this.lead_action_status_menu = true;
  }

  updateLeadStatus(lead_status_id: any): void {
    let updatedLead = {
      lead_status_id: lead_status_id, // Take from new selected status
      lead_id: this.lead_id,
      title: this.title,
      first_name: this.first_name,
      last_name: this.last_name,
      company: this.company,
      phone_number: this.phone_number,
      email: this.email,
      photo_url: this.photo_url,
      source: this.source,
      updated_at: new Date().toISOString(),
      workspace_id: this.currentWorkspaceId
      };

    this.leadService.updateLead(updatedLead).subscribe(response => {
      console.log(response);
      this.getLeads();
      this.onReset();
    });
  }

  sortLeads(sortFactor: any): void {
    if (sortFactor === 'last_name') {
      this.filteredLeads.sort((a: any, b: any) => {
        const lastNameA = a.last_name?.toLowerCase() ?? '';
        const lastNameB = b.last_name?.toLowerCase() ?? '';

        this.active_sort_factor = 'By Last Name';

        return lastNameA.localeCompare(lastNameB);
      });
    }

    if (sortFactor === 'first_name') {
      this.filteredLeads.sort((a: any, b: any) => {
        const firstNameA = a.first_name?.toLowerCase() ?? '';
        const firstNameB = b.first_name?.toLowerCase() ?? '';

        this.active_sort_factor = 'By First Name';

        return firstNameA.localeCompare(firstNameB);
      });
    }

    if (sortFactor === 'company') {
      this.filteredLeads.sort((a: any, b: any) => {
        const companyA = a.company?.toLowerCase() ?? '';
        const companyB = b.company?.toLowerCase() ?? '';

        this.active_sort_factor = 'By Company';

        return companyA.localeCompare(companyB);
      });
    }

    if (sortFactor === 'status') {
      this.filteredLeads.sort((a: any, b: any) => {
        const statusA = a.lead_status_id;
        const statusB = b.lead_status_id;

        this.active_sort_factor = 'By Status';

        return statusA - statusB;
      });
    }

    if (sortFactor === 'created_at') {
      this.filteredLeads.sort((a: any, b: any) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);

        this.active_sort_factor = 'By Date Created';

        return dateB.getTime() - dateA.getTime();
      });
    }

    this.sort_by_dropdown = false;
  }

  // // CSV Exporting

  generateCSV(): string {
    let csv = 'Last Name, First Name, Title, Company, Phone Number, Email, Status, Source, Owner\n';

    this.filteredLeads.forEach((lead: any) => {
      csv += `${lead.last_name}, ${lead.first_name}, ${lead.title}, ${lead.company}, ${lead.phone_number}, ${lead.email}, ${this.getLeadStatus(lead.lead_status_id)}, ${lead.source}, ${lead.owner}\n`;
    });

    return csv;
  }

  downloadCSV(): void {
    const csvData = this.generateCSV();
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  printData(): void {
    // Print in csv format
    const csvData = this.generateCSV();
    const printWindow = window.open('', '', 'height=400,width=800');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Leads</title>');
      printWindow.document.write('</head><body>');
      printWindow.document.write('<pre>');
      printWindow.document.write(csvData);
      printWindow.document.write('</pre>');
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  }

  // Card and list views
  toggleCardView() {
    this.card_view = !this.card_view;
    if (this.card_view && this.list_view) {
      this.list_view = false;
    } else if (!this.card_view && !this.list_view) {
      this.card_view = true;
    }
  }

  toggleListView() {
    this.list_view = !this.list_view;
    if (this.list_view && this.card_view) {
      this.card_view = false;
    } else if (!this.list_view && !this.card_view) {
      this.list_view = true;
    }
  }

  // Phone number formatting
  onPhoneNumberChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const numericValue = input.value.replace(/\D/g, '');
    
    this.phone_number = numericValue;
    this.formatPhoneNumber();
    input.value = this.phone_number;
  }

  formatPhoneNumber(): void {
    if (this.phone_number) {
      let formatted = this.phone_number;
      if (formatted.length > 6) {
        formatted = `(${formatted.slice(0, 3)}) ${formatted.slice(3, 6)}-${formatted.slice(6, 10)}`;
      } else if (formatted.length > 3) {
        formatted = `(${formatted.slice(0, 3)}) ${formatted.slice(3)}`;
      } else {
        formatted = formatted.slice(0, 3);
      }
      this.phone_number = formatted;
    }
  }

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

    // Close any open components
    this.leads_action_sidebar_container = false;
    this.leads_action_container = false
    this.lead_edit_mode = false;
    this.lead_action_status_menu = false;
    this.more_info_dropdown = false;
    this.filterLeadStatus(0);
    this.getLeads();
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
