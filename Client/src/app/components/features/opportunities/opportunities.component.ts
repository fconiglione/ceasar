import { Component, ElementRef } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faChevronDown, faSearch, faDownload, faPhone, faEnvelope, faEllipsisV, faCircleInfo, faEye, faEdit, faTrash, faArrowLeft, faSort, faBars, faTableCells, faUserAlt, faArrowRightToBracket, faXmark, faPenToSquare, faSquare, faClipboardUser, faSackDollar, faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { OpportunityService } from '../../../services/opportunity/opportunity.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from '../../loading/loading.component';
import { AuthService } from '@auth0/auth0-angular';
import { NoDataComponent } from "../../no-data/no-data.component";
import { AccountService } from '../../../services/accounts/account.service';
import { ContactService } from '../../../services/contact/contact.service';

@Component({
  selector: 'app-opportunities',
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
  templateUrl: './opportunities.component.html',
  styleUrl: './opportunities.component.css'
})

export class OpportunitiesComponent {
  // User components
  username: string | undefined;

  // Opportunity components
  OPPORTUNITY: any;
  sub: string | undefined;
  opportunity_id: string | undefined;
  workspace_id: string | undefined;
  account_id: string | undefined = '';
  contact_id: string | undefined;
  opportunity_status_id: string | undefined = '';
  title: string | undefined;
  closing_date: string | undefined;
  value: string | undefined;
  prediction_score: string | undefined;
  created_at: string | undefined;
  updated_at: string | undefined;

  // Account and Contact Declarations
  ACCOUNT: any;
  name: string | undefined;
  CONTACT: any;
  // title already declared above
  first_name: string | undefined;
  last_name: string | undefined;

  // Component actions
  opportunities_action_container: boolean = false;
  opportunities_action_sidebar_container: boolean = false;
  opportunity_edit_mode: boolean = false;
  loading: boolean = true;
  more_info_dropdown: boolean = false;
  card_view: boolean = true;
  list_view: boolean = false;
  sort_by_dropdown: boolean = false;
  opportunity_action_status_menu: boolean = false;
  opportunity_action_status_menu_2: boolean = false;

  // Other variables
  opportunity_status: string | undefined;
  opportunity_count: number = 0;
  opportunity_status_new_count: number = 0;
  opportunity_status_talking_count: number = 0;
  opportunity_status_meeting_count: number = 0;
  opportunity_status_proposal_count: number = 0;
  opportunity_status_closed_won_count: number = 0;
  opportunity_status_closed_lost_count: number = 0;
  previous_status_filter: number = 0;
  active_status_filter: number = 0;
  active_sort_factor: string = 'By Title';
  allOpportunities: any[] = [];  // This should be initialized with the complete list of opportunities
  filteredOpportunities: any[] = [];

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
  faClipboardUser = faClipboardUser;
  faSackDollar = faSackDollar;
  faCalendarDay = faCalendarDay;

  currentWorkspaceId: string | undefined;

  opportunitySearchInputValue: string = '';
  activeStatusFilter: string = 'All status';

  ShapesBanner = "assets/images/shapes-banner.svg";
  DefaultPFP = "assets/images/default-pfp.svg";

  constructor( private opportunityService: OpportunityService, private route: ActivatedRoute, private router: Router, private elementRef: ElementRef, private authService: AuthService, private accountService: AccountService, private contactService: ContactService ) { }

  getOpportunities(): void {
    // Get opportunities from the API
    this.opportunityService.getOpportunities(this.currentWorkspaceId).subscribe((opportunities: any) => {
      this.allOpportunities = opportunities;
      this.filteredOpportunities = opportunities;
      this.countOpportunities();
      this.sortOpportunities('title'); // Sort by title by default
      this.loading = false;
    });
  }

  createOpportunity(): void {
    let newOpportunity = {
      sub  : this.sub,
      workspace_id : this.currentWorkspaceId,
      title : this.title,
      account_id: this.account_id,
      contact_id: this.contact_id,
      opportunity_status_id: this.opportunity_status_id,
      closing_date: this.closing_date,
      value: this.value,
      prediction_score: this.prediction_score,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.opportunityService.createOpportunity(newOpportunity).subscribe(response => {
      console.log(response);
      this.getOpportunities();
      this.onReset();
    });
  }

  updateOpportunity(): void {
    if (confirm('Are you sure you want to make changes to this opportunity? All changes are final and cannot be undone.')) {
      let updatedOpportunity = {
        opportunity_id: this.opportunity_id,
        title: this.title,
        account_id: this.account_id,
        contact_id: this.contact_id,
        closing_date: this.closing_date,
        value: this.value,
        prediction_score: this.prediction_score,
        opportunity_status_id: this.opportunity_status_id,
        updated_at: new Date().toISOString(),
        workspace_id: this.currentWorkspaceId
      };

      this.opportunityService.updateOpportunity(updatedOpportunity).subscribe(response => {
        console.log(response);
        this.getOpportunities();
        this.onReset();
      });
    }
  }

  deleteOpportunity(): void {
    if (confirm('Are you sure you want to delete this opportunity? This action cannot be undone.')) {
      this.opportunityService.deleteOpportunity(this.opportunity_id).subscribe(response => {
        console.log(response);
        this.getOpportunities();
        this.onReset();
      });
    }
  }

  // Deletion from directly within the list
  deleteOpportunityById(opportunity_id: string): void {
    if (confirm('Are you sure you want to delete this opportunity? This action cannot be undone.')) {
      this.opportunityService.deleteOpportunity(opportunity_id).subscribe(response => {
        console.log(response);
        this.getOpportunities();
      });
    }
  }

  getOpportunityStatus(opportunity_status_id: any) {
    switch (opportunity_status_id) {
      case 1:
        return 'New';
      case 2:
        return 'Talking';
      case 3:
        return 'Meeting';
      case 4:
        return 'Proposal';
      case 5:
        return 'Closed-Won';
      case 6:
        return 'Closed-Lost';
      default:
        return 'Not provided';
    }
  }

  getOpportunityStatusClasses(opportunity_status_id: any) {
    switch (opportunity_status_id) {
      case 1:
        return { 'opportunity-status': true, 'new': true };
      case 2:
        return { 'opportunity-status': true, 'talking': true };
      case 3:
        return { 'opportunity-status': true, 'meeting': true };
      case 4:
        return { 'opportunity-status': true, 'proposal': true };
      case 5:
        return { 'opportunity-status': true, 'closed-won': true };
      case 6:
        return { 'opportunity-status': true, 'closed-lost': true };
      default:
        return { 'opportunity-status': true, 'not-provided': true };
    }
  }

  onInputChange(event: any) {
    const searchInputValue = event.target.value.trim().toLowerCase();
    this.opportunitySearchInputValue = searchInputValue;
  
    if (this.opportunitySearchInputValue.length > 0) {
      this.countOpportunities();
      this.filteredOpportunities = this.allOpportunities.filter((opportunity: any) => {
        const title = opportunity.title?.toLowerCase() ?? '';
        const closing_date = opportunity.closing_date?.toLowerCase() ?? '';
        const value = opportunity.value.toString()?.toLowerCase() ?? '';
        const prediction_score = opportunity.prediction_score.toString()?.toLowerCase() ?? '';
        const status = this.getOpportunityStatus(opportunity.opportunity_status_id).toLowerCase();
  
        return title.includes(this.opportunitySearchInputValue) ||
          closing_date.includes(this.opportunitySearchInputValue) ||
          value.includes(this.opportunitySearchInputValue) ||
          prediction_score.includes(this.opportunitySearchInputValue) ||
          status.includes(this.opportunitySearchInputValue);
      });
    } else {
      this.countOpportunities();
      this.filteredOpportunities = this.allOpportunities;
    }
  }

  countOpportunities(): void {
    this.opportunity_count = this.filteredOpportunities.length;
    this.opportunity_status_new_count = this.filteredOpportunities.filter((opportunity: any) => opportunity.opportunity_status_id === 1).length;
    this.opportunity_status_talking_count = this.filteredOpportunities.filter((opportunity: any) => opportunity.opportunity_status_id === 2).length;
    this.opportunity_status_meeting_count = this.filteredOpportunities.filter((opportunity: any) => opportunity.opportunity_status_id === 3).length;
    this.opportunity_status_proposal_count = this.filteredOpportunities.filter((opportunity: any) => opportunity.opportunity_status_id === 4).length;
    this.opportunity_status_closed_won_count = this.filteredOpportunities.filter((opportunity: any) => opportunity.opportunity_status_id === 5).length
    this.opportunity_status_closed_lost_count = this.filteredOpportunities.filter((opportunity: any) => opportunity.opportunity_status_id === 6).length;
  } 
  
  filterOpportunityStatus(opportunity_status_id: number): void {
      this.active_status_filter = opportunity_status_id;
      if (opportunity_status_id === this.previous_status_filter) {
          this.getOpportunities();
          this.previous_status_filter = 0;
      } else {
          if (opportunity_status_id === 0) {
            this.getOpportunities();
          } else {
              this.opportunityService.getOpportunities(this.currentWorkspaceId).subscribe(response => {
                  this.filteredOpportunities = response as any[];
                  this.countOpportunities();
                  this.filteredOpportunities = this.filteredOpportunities.filter((opportunity: any) => opportunity.opportunity_status_id === opportunity_status_id);
                  this.previous_status_filter = opportunity_status_id;
                  this.activeStatusFilter = this.getOpportunityStatus(opportunity_status_id);
              });
          }
      }
  }

  openOpportunitiesActionSidebar(opportunity: any): void {
    // Setting the opportunity details
    this.opportunity_id = opportunity.opportunity_id;
    this.title = opportunity.title;
    this.account_id = opportunity.account_id;
    this.contact_id = opportunity.contact_id;
    this.closing_date = opportunity.closing_date;
    this.value = opportunity.value;
    this.prediction_score = opportunity.prediction_score;
    this.opportunity_status_id = opportunity.opportunity_status_id;
    this.created_at = opportunity.created_at;
    this.updated_at = opportunity.updated_at
    this.opportunities_action_sidebar_container = true;
  }

  openOpportunityStatusMenu(opportunity: any): void {
    this.opportunity_status_id = opportunity.opportunity_status_id;
    this.opportunity_id = opportunity.opportunity_id;
    this.title = opportunity.title;
    this.account_id = opportunity.account_id;
    this.contact_id = opportunity.contact_id;
    this.closing_date = opportunity.closing_date;
    this.value = opportunity.value;
    this.prediction_score = opportunity.prediction_score;
    this.created_at = opportunity.created_at;
    this.updated_at = opportunity.updated_at;
    this.opportunity_status_id = opportunity.opportunity_status_id;
    this.opportunity_action_status_menu = true;
  }

  updateOpportunityStatus(opportunity_status_id: any): void {
    let updatedOpportunity = {
      opportunity_status_id: opportunity_status_id, // Take from new selected status
      opportunity_id: this.opportunity_id,
      title: this.title,
      account_id : this.account_id,
      contact_id : this.contact_id,
      closing_date: this.closing_date,
      value: this.value,
      prediction_score: this.prediction_score,
      updated_at: new Date().toISOString(),
      workspace_id: this.currentWorkspaceId
      };

    this.opportunityService.updateOpportunity(updatedOpportunity).subscribe(response => {
      console.log(response);
      this.getOpportunities();
      this.onReset();
    });
  }

  openOpportunityPredictionScoreMenu(opportunity: any): void {
    this.opportunity_id = opportunity.opportunity_id;
    this.title = opportunity.title;
    this.account_id = opportunity.account_id;
    this.contact_id = opportunity.contact_id;
    this.closing_date = opportunity.closing_date;
    this.value = opportunity.value;
    this.prediction_score = opportunity.prediction_score;
    this.created_at = opportunity.created_at;
    this.updated_at = opportunity.updated_at;
    this.opportunity_status_id = opportunity.opportunity_status_id;
    this.opportunity_action_status_menu_2 = true;
  }

  updateOpportunityPredictionScore(prediction_score: any): void {
    let updatedOpportunity = {
      opportunity_id: this.opportunity_id,
      title: this.title,
      account_id: this.account_id,
      contact_id: this.contact_id,
      closing_date: this.closing_date,
      value: this.value,
      prediction_score: prediction_score,
      opportunity_status_id: this.opportunity_status_id,
      updated_at: new Date().toISOString(),
      workspace_id: this.currentWorkspaceId
    };

    this.opportunityService.updateOpportunity(updatedOpportunity).subscribe(response => {
      console.log(response);
      this.getOpportunities();
      this.onReset();
    });
  }

  sortOpportunities(sortFactor: any): void {
    if (sortFactor === 'title') {
      this.filteredOpportunities.sort((a: any, b: any) => {
        const titleA = a.title?.toLowerCase() ?? '';
        const titleB = b.title?.toLowerCase() ?? '';

        this.active_sort_factor = 'By Title';

        return titleA.localeCompare(titleB);
      });
    }

    if (sortFactor === 'value') {
      this.filteredOpportunities.sort((a: any, b: any) => {
        const valueA = a.value;
        const valueB = b.value;

        this.active_sort_factor = 'By Value';

        return valueB - valueA;
      });
    }

    if (sortFactor === 'prediction_score') {
      this.filteredOpportunities.sort((a: any, b: any) => {
        const predictionScoreA = a.prediction_score;
        const predictionScoreB = b.prediction_score;

        this.active_sort_factor = 'By Prediction Score';

        return predictionScoreB - predictionScoreA;
      });
    }

    if (sortFactor === 'status') {
      this.filteredOpportunities.sort((a: any, b: any) => {
        const statusA = a.opportunity_status_id;
        const statusB = b.opportunity_status_id;

        this.active_sort_factor = 'By Status';

        return statusA - statusB;
      });
    }

    if (sortFactor === 'closing_date') {
      this.filteredOpportunities.sort((a: any, b: any) => {
        const dateA = new Date(a.closing_date);
        const dateB = new Date(b.closing_date);

        this.active_sort_factor = 'By Closing Date';

        return dateB.getTime() - dateA.getTime();
      });
    }

    if (sortFactor === 'created_at') {
      this.filteredOpportunities.sort((a: any, b: any) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);

        this.active_sort_factor = 'By Creation Date';

        return dateB.getTime() - dateA.getTime();
      });
    }

    this.sort_by_dropdown = false;
  }

  // // CSV Exporting

  generateCSV(): string {
    let csv = 'Title, Value, Prediction Score, Status, Closing Date, Account, Contact, Owner\n';

    this.filteredOpportunities.forEach((opportunity: any) => {
      csv += `${opportunity.title}, ${opportunity.value}, ${opportunity.prediction_score}, ${this.getOpportunityStatus(opportunity.opportunity_status_id)}, ${opportunity.closing_date},${opportunity.account_id}, ${opportunity.contact_id}, ${opportunity.username}\n`;
    });

    return csv;
  }

  downloadCSV(): void {
    const csvData = this.generateCSV();
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'opportunities.csv';
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
      printWindow.document.write('<html><head><title>Opportunities</title>');
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

  // Get accounts
  getAccounts(): void {
    this.accountService.getAccounts(this.currentWorkspaceId).subscribe((accounts: any) => {
      this.ACCOUNT = accounts;
    });
  }

  // Get contacts
  getContacts(): void {
    this.contactService.getContacts(this.currentWorkspaceId).subscribe((contacts: any) => {
      this.CONTACT = contacts;
    });
  }

  // Classes for prediction score
  getPredictionScoreClasses(prediction_score: any) {
    if (prediction_score >= 75) {
        return { 'prediction-score': true, 'excellent': true };
    } else if (prediction_score >= 50) {
        return { 'prediction-score': true, 'good': true };
    } else if (prediction_score >= 25) {
        return { 'prediction-score': true, 'average': true };
    } else if (prediction_score > 0) {
        return { 'prediction-score': true, 'poor': true };
    } else {
        return { 'prediction-score': true, 'not-provided': true };
    }
}

formatCurrency(value: any): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

  onReset(): void {
    // Reset the new opportunity form
    this.title = '';
    this.account_id = '';
    this.contact_id = undefined;
    this.value = '';
    this.prediction_score = '';
    this.closing_date = '';
    this.opportunity_status_id = '';
    this.created_at = '';
    this.updated_at = '';

    // Close any open components
    this.opportunities_action_sidebar_container = false;
    this.opportunities_action_container = false
    this.opportunity_edit_mode = false;
    this.opportunity_action_status_menu = false;
    this.opportunity_action_status_menu_2 = false;
    this.more_info_dropdown = false;
    this.filterOpportunityStatus(0);
    this.getOpportunities();
  }

  // Get Contact Name By Id
  getContactNameById(contact_id: string): string {
    const contact = this.CONTACT.find((contact: any) => contact.contact_id === contact_id);
    return contact ? `${contact.first_name} ${contact.last_name}` : 'Not provided';
  }

  // Get Account Name By Id
  getAccountNameById(account_id: string): string {
    const account = this.ACCOUNT.find((account: any) => account.account_id === account_id);
    return account ? account.name : 'Not provided';
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
            this.getOpportunities();
            this.getAccounts();
            this.getContacts();
          });
        }
      });
    } else {
      console.log('Not a workspace path');
    }
  }
}
