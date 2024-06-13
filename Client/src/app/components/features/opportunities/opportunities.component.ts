import { Component, ElementRef } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faChevronDown, faSearch, faDownload, faUser, faEnvelope, faEllipsisV, faCircleInfo, faEye, faEdit, faTrash, faArrowLeft, faSackDollar } from '@fortawesome/free-solid-svg-icons';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { OpportunityService } from '../../../services/opportunity/opportunity.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../services/accounts/account.service';

@Component({
  selector: 'app-opportunities',
  standalone: true,
  imports: [
    FaIconComponent,
    NgFor,
    NgIf,
    DatePipe,
    CommonModule,
    FormsModule
  ],
  templateUrl: './opportunities.component.html',
  styleUrl: './opportunities.component.css'
})
export class OpportunitiesComponent {
  // Opportunity card variables
  OPPORTUNITY: any;
  opportunity_id: string | undefined;
  opportunityName: string | undefined;
  value: string | undefined;
  title: string | undefined;
  description: string | undefined;
  creation_date: string | undefined;
  opportunity_status_id: string | undefined;

  // Accounts
  ACCOUNT: any;
  account_name: string | undefined;
  account_id: string | undefined;
  accountNamesMap: { [key: string]: string } = {};

  // Users
  USER: any[] = [];
  user_name: string | undefined;
  user_id: string | undefined;

  loading: boolean = true;
  currentWorkspaceId: string | undefined;

  opportunitySearchInputValue: string = '';
  activeStatusFilter: string = 'All status';

  newOpportunityCount: number = 0;
  qualificationOpportunityCount: number = 0;
  negotiationOpportunityCount: number = 0;
  closedOpportunityCount: number = 0;

  ShapesBanner = "assets/images/shapes-banner.svg";
  faChevronDown = faChevronDown;
  faSearch = faSearch;
  faDownload = faDownload;
  faUser = faUser;
  faEnvelope = faEnvelope;
  faEllipsisV = faEllipsisV;
  faCircleInfo = faCircleInfo;
  DefaultPFP = "assets/images/default-pfp.svg";
  faEye = faEye;
  faEdit = faEdit;
  faTrash = faTrash;
  faArrowLeft = faArrowLeft;
  faSackDollar = faSackDollar;

  constructor( private accountService: AccountService, private opportunityService: OpportunityService, private route: ActivatedRoute, private router: Router, private elementRef: ElementRef ) { }

  getOpportunity(): void {
    // Get opportunity from the API
    this.opportunityService.getOpportunities(this.currentWorkspaceId).subscribe(response => {
      this.OPPORTUNITY = response;
      this.countOpportunity();
      this.loading = false;
    });
  }

  getAccounts(): void {
    // Get accounts from the API
    this.accountService.getAccounts(this.currentWorkspaceId).subscribe(response => {
      this.ACCOUNT = response;
      this.accountNamesMap = {};

      this.ACCOUNT.forEach((account: any) => {
        this.accountNamesMap[account.account_id] = account.account_name;
      });
    });
  }

  getAccountNameByAccountId(accountId: string): string {
    return this.accountNamesMap[accountId] || 'Unassigned';
  }

  getUsers(): void {
    this.USER = [
    {
      user_name: 'John Doe', // Placeholder
      user_id: '1' // Placeholder
    }
  ];
  }

  countOpportunity(): void {
    // Count the number of opportunity in each status
    this.newOpportunityCount = this.OPPORTUNITY.filter((opportunity: any) => opportunity.opportunity_status_id === 1).length;
    this.qualificationOpportunityCount = this.OPPORTUNITY.filter((opportunity: any) => opportunity.opportunity_status_id === 2).length;
    this.negotiationOpportunityCount = this.OPPORTUNITY.filter((opportunity: any) => opportunity.opportunity_status_id === 3).length;
    this.closedOpportunityCount = this.OPPORTUNITY.filter((opportunity: any) => opportunity.opportunity_status_id === 4).length;
  }

  getStatus(statusId: string): string {
    switch (statusId) {
      case '1':
        return 'New';
      case '2':
        return 'Qualification';
      case '3':
        return 'Negotiation';
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
        return { 'status': true, 'qualification': true };
      case '3':
        return { 'status': true, 'negotation': true };
      case '4':
        return { 'status': true, 'closed': true };
      default:
        return { 'status': true, 'unassigned': true };
    }
  }

  openNewOpportunityPopup(): void {
    // Open the new opportunity popup
    const newOpportunityPopup = this.elementRef.nativeElement.querySelector('.create-opportunity-pop-up');
    newOpportunityPopup.style.display = 'block';

    // Also get the accounts and assignees
    this.getAccounts();
    this.getUsers();
  }

  closeNewOpportunityPopup(): void {
    // Close the new opportunity popup
    const newOpportunityPopup = this.elementRef.nativeElement.querySelector('.create-opportunity-pop-up');
    newOpportunityPopup.style.display = 'none';
    this.onReset();
  }

  createOpportunity(): void {
    let newOpportunity = {
      title: this.title,
      value: this.value,
      user_id: this.user_id,
      account_id: this.account_id,
      description: this.description,
      workspace_id: this.currentWorkspaceId,
      opportunity_status_id: this.opportunity_status_id
    };

    this.opportunityService.createOpportunity(newOpportunity).subscribe(response => {
      console.log(response);
      this.getOpportunity();
      this.closeNewOpportunityPopup();
    });
  }
  statusFilterDropdownActive: boolean = false;

  openFilterStatusDropdown(): void {
    const statusFilterDropdown = this.elementRef.nativeElement.querySelector('.filter-dropdown');
    if (statusFilterDropdown) {
      this.statusFilterDropdownActive = !this.statusFilterDropdownActive;
      statusFilterDropdown.style.display = this.statusFilterDropdownActive ? 'flex' : 'none';
    }
  }
  
  closeFilterStatusDropdown(): void {
    const statusFilterDropdown = this.elementRef.nativeElement.querySelector('.filter-dropdown');
    if (statusFilterDropdown) {
      statusFilterDropdown.style.display = 'none';
      this.statusFilterDropdownActive = false;
    }
  }  
  
  previousStatus: number = 0;
  filterStatus(statusId: number): void {
    this.closeFilterStatusDropdown();
      if (statusId === this.previousStatus) {
          this.getOpportunity();
          this.activeStatusFilter = 'All status';
          this.previousStatus = 0;
      } else {
          if (statusId === 0) {
            this.activeStatusFilter = 'All status';
            this.getOpportunity();
          } else {
              this.opportunityService.getOpportunities(this.currentWorkspaceId).subscribe(response => {
                  this.OPPORTUNITY = response;
                  this.countOpportunity();
                  this.OPPORTUNITY = this.OPPORTUNITY.filter((opportunity: any) => opportunity.opportunity_status_id === statusId);
                  this.previousStatus = statusId;
                  this.activeStatusFilter = this.getStatus(statusId.toString());
              });
          }
      }
  }

  onInputChange(event: any) {
    const searchInputValue = event.target.value.trim();
    this.opportunitySearchInputValue = searchInputValue;
  
    if (this.opportunitySearchInputValue === '') {
      this.getOpportunity();
    } else {
      this.countOpportunity();
      this.OPPORTUNITY = this.OPPORTUNITY.filter((opportunity: any) => {
        const firstName = opportunity.first_name?.toLowerCase() ?? '';
        const lastName = opportunity.last_name?.toLowerCase() ?? '';
        const company = opportunity.company?.toLowerCase() ?? '';
        const phoneNumber = opportunity.phone_number?.toLowerCase() ?? '';
        const email = opportunity.email?.toLowerCase() ?? '';
        const status = this.getStatus(opportunity.status_id).toLowerCase();
  
        return firstName.includes(this.opportunitySearchInputValue.toLowerCase()) ||
          lastName.includes(this.opportunitySearchInputValue.toLowerCase()) ||
          company.includes(this.opportunitySearchInputValue.toLowerCase()) ||
          phoneNumber.includes(this.opportunitySearchInputValue.toLowerCase()) ||
          email.includes(this.opportunitySearchInputValue.toLowerCase()) ||
          status.includes(this.opportunitySearchInputValue.toLowerCase());
      });
    }
  }  

  // CSV Exporting

  generateCSV(): string {
    let csv = 'Title,Value,Account Name,Status,Assigned To,Description \n';

    this.OPPORTUNITY.forEach((opportunity: any) => {
      const row = `${opportunity.title || ''},${opportunity.value || ''},${this.getAccountNameByAccountId(opportunity.account_id) || ''},${this.getStatus(opportunity.opportunity_status_id.toString())},${opportunity.user_name || ''},${opportunity.description || ''}\n`;
      csv += row;
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

  toggleOpportunityCardDropdown(opportunity: any): void {
    this.OPPORTUNITY.forEach((l: any) => {
      if (l !== opportunity) {
        l.showSubSetting = false;
      }
    });
    opportunity.showSubSetting = !opportunity.showSubSetting;
  }

  deleteOpportunity(opportunity: any): void {
    if (confirm('Are you sure you want to delete this opportunity?')) {
      this.opportunityService.deleteOpportunity(opportunity.opportunity_id).subscribe(response => {
        this.getOpportunity();
      });
    }
  }

  closeOpportunityDetailsPopUp(): void {
    const opportunityDetailsPopUp = this.elementRef.nativeElement.querySelector('.opportunity-details-pop-up');
    opportunityDetailsPopUp.style.display = 'none';

    this.opportunity_id = undefined;
    this.description = undefined;

    this.opportunitiesEditMode = false;
  }

  openOpportunityDetailsPopUp(opportunity: any): void {
    this.opportunity_id = opportunity.opportunity_id;
    this.description = opportunity.description;

    const opportunityDetailsPopUp = this.elementRef.nativeElement.querySelector('.opportunity-details-pop-up');
    opportunityDetailsPopUp.style.display = 'block';
  }

  updateOpportunity(): void {
    let updatedOpportunity = {
      opportunity_id: this.opportunity_id,
      description: this.description
    };

    this.opportunityService.updateOpportunity(updatedOpportunity).subscribe(response => {
      console.log(response);
      this.getOpportunity();
      this.closeOpportunityDetailsPopUp();
    });
  }

  opportunitiesEditMode: boolean = false;

  toggleOpportunitiesEditMode(): void {
    this.opportunitiesEditMode = !this.opportunitiesEditMode;
  }

  onReset(): void {
    // Reset the new opportunity form
    this.description = undefined;
    this.user_name = undefined;
    this.account_name = undefined;
    this.title = '',
    this.value = ''
  }

  isWorkspacePath(): boolean {
    return this.router.url.startsWith('/ws');
  }

  ngOnInit() {
    if (this.isWorkspacePath()) {
      this.route.queryParams.subscribe(params => {
        this.currentWorkspaceId = params['workspace_id'] || '';
        this.getOpportunity();
        this.getAccounts();
      });
    } else {
      console.log('Not a workspace path');
    }
  }
}