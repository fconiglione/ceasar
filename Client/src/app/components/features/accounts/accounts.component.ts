import { Component, ElementRef } from '@angular/core';
import { faChevronDown, faSearch, faDownload, faPhone, faEnvelope, faEllipsisV, faCircleInfo, faEye, faEdit, faTrash, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../services/accounts/account.service';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [
    FaIconComponent,
    NgFor, NgIf, DatePipe,
    CommonModule,
    FormsModule
  ],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css'
})
export class AccountsComponent {
  // Accounts card
  ACCOUNT: any;
  account_id: string | undefined;
  account_name: string | undefined;
  phone_number: string | undefined;
  email: string | undefined;
  source: string | undefined;
  description: string | undefined;
  creation_date: string | undefined;
  loading: boolean = true;
  currentWorkspaceId: string | undefined;
  type: string | undefined;
  type_id: string | undefined;

  accountSearchInputValue: string = '';

  ShapesBanner = "assets/images/shapes-banner.svg";
  faChevronDown = faChevronDown;
  faSearch = faSearch;
  faDownload = faDownload;
  faPhone = faPhone;
  faEnvelope = faEnvelope;
  faEllipsisV = faEllipsisV;
  faCircleInfo = faCircleInfo;
  DefaultPFP = "assets/images/default-pfp.svg";
  faEye = faEye;
  faEdit = faEdit;
  faTrash = faTrash;
  faArrowLeft = faArrowLeft;

  constructor(private accountService: AccountService, private route: ActivatedRoute, private router: Router, private elementRef: ElementRef) { }

  getAccounts(): void {
    // Get accounts from the API
    this.accountService.getAccounts(this.currentWorkspaceId).subscribe(response => {
      this.ACCOUNT = response;
      this.loading = false;
    });
  }

  getType(typeId: string): string {
    switch (typeId) {
      case '1':
        return 'Customer';
      case '2':
        return 'Prospect';
      default:
        return 'Unassigned';
    }
  }

  getTypeClasses(typeId: string): any {
    switch (typeId) {
      case '1':
        return { 'type': true, 'customer': true };
      case '2':
        return { 'type': true, 'prospect': true };
      default:
        return { 'type': true, 'unassigned': true };
    }
  }

  openNewAccountPopup(): void {
    // Open the new account popup screen
    const newaccountPopup = this.elementRef.nativeElement.querySelector('.create-account-pop-up');
    newaccountPopup.style.display = 'block';
  }

  closeNewAccountPopup(): void {
    // Close the new account popup screen
    const newaccountPopup = this.elementRef.nativeElement.querySelector('.create-account-pop-up');
    newaccountPopup.style.display = 'none';
    this.onReset();
  }

  createAccount(): void {
    let newAccount = {
      account_name: this.account_name,
      phone_number: this.phone_number,
      email: this.email,
      description: this.description,
      workspace_id: this.currentWorkspaceId,
      type_id: this.type_id,
      source: this.source
    };

    this.accountService.createAccount(newAccount).subscribe(response => {
      console.log(response);
      this.getAccounts();
      this.closeNewAccountPopup();
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

  activeTypeFilter: string = 'All types';
  previousType: number = 0;
  filterStatus(typeId: number): void {
    this.closeFilterStatusDropdown();
      if (typeId === this.previousType) {
          this.getAccounts();
          this.activeTypeFilter = 'All types';
          this.previousType = 0;
      } else {
          if (typeId === 0) {
            this.activeTypeFilter = 'All status';
            this.getAccounts();
          } else {
              this.accountService.getAccounts(this.currentWorkspaceId).subscribe(response => {
                  this.ACCOUNT = response;
                  this.ACCOUNT = this.ACCOUNT.filter((account: any) => account.type_id === typeId);
                  this.previousType = typeId;
                  this.activeTypeFilter = this.getType(typeId.toString());
              });
          }
      }
  }

  onInputChange(event: any) {
    const searchInputValue = event.target.value.trim();
    this.accountSearchInputValue = searchInputValue;
  
    if (this.accountSearchInputValue === '') {
      this.getAccounts();
    } else {
      this.ACCOUNT = this.ACCOUNT.filter((account: any) => {
        const accountName = account.account_name?.toLowerCase() ?? '';
        const phoneNumber = account.phone_number?.toLowerCase() ?? '';
        const email = account.email?.toLowerCase() ?? '';
        const type = this.getType(account.type_id).toLowerCase();
  
        return accountName.includes(this.accountSearchInputValue.toLowerCase()) ||
          type.includes(this.accountSearchInputValue.toLowerCase()) ||
          phoneNumber.includes(this.accountSearchInputValue.toLowerCase()) ||
          email.includes(this.accountSearchInputValue.toLowerCase());
        });
    }
  }  

  // CSV Exporting

  generateCSV(): string {
    let csv = 'Account Name,Type,Phone Number,Email,Source\n';

    this.ACCOUNT.forEach((account: any) => {
      const row = `${account.account_name || ''},${this.getType(account.type_id.toString())},${account.phone_number || ''},${account.email || ''}, ${account.source || 'N/A'}\n`;
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
    a.download = 'accounts.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  toggleAccountCardDropdown(account: any): void {
    this.ACCOUNT.forEach((c: any) => {
      if (c !== account) {
        c.showSubSetting = false;
      }
    });
    account.showSubSetting = !account.showSubSetting;
  }

  deleteAccount(account: any): void {
    if (confirm('Are you sure you want to delete this account?')) {
      this.accountService.deleteAccount(account.account_id).subscribe(response => {
        this.getAccounts();
      });
    }
  }

  closeAccountDetailsPopUp(): void {
    const accountDetailsPopUp = this.elementRef.nativeElement.querySelector('.account-details-pop-up');
    accountDetailsPopUp.style.display = 'none';

    this.account_id = undefined;
    this.account_name = undefined;
    this.phone_number = undefined;
    this.email = undefined;
    this.description = undefined;
    this.account_name = undefined;
    this.source = undefined;
    this.type = undefined;
    this.type_id = undefined;

    this.accountsEditMode = false;
  }

  openAccountDetailsPopUp(account: any): void {
    this.account_id = account.account_id;
    this.account_name = account.account_name;
    this.phone_number = account.phone_number;
    this.email = account.email;
    this.description = account.description;
    this.source = account.source;
    this.type = this.getType(account.type_id);
    this.type_id = account.type_id;

    const accountDetailsPopUp = this.elementRef.nativeElement.querySelector('.account-details-pop-up');
    accountDetailsPopUp.style.display = 'block';
  }

  updateAccount(): void {
    let updatedAccount = {
      account_id: this.account_id,
      account_name: this.account_name,
      phone_number: this.phone_number,
      email: this.email,
      description: this.description,
      source: this.source,
      type_id: this.type_id
    };

    this.accountService.updateAccount(updatedAccount).subscribe(response => {
      console.log(response);
      this.getAccounts();
      this.closeAccountDetailsPopUp();
    });
  }

  accountsEditMode: boolean = false;

  toggleAccountsEditMode(): void {
    this.accountsEditMode = !this.accountsEditMode;
  }

  onReset(): void {
    // Reset the new account form
    this.account_name = '';
    this.source = '';
    this.phone_number = '';
    this.email = '';
    this.type_id = undefined;
    this.description = undefined;
  }

  isWorkspacePath(): boolean {
    return this.router.url.startsWith('/ws');
  }

  ngOnInit() {
    if (this.isWorkspacePath()) {
      this.route.queryParams.subscribe(params => {
        this.currentWorkspaceId = params['workspace_id'] || '';
        this.getAccounts();
      });
    } else {
      console.log('Not a workspace path');
    }
  }

}