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
  first_name: string | undefined;
  last_name: string | undefined;
  company: string | undefined;
  phone_number: string | undefined;
  email: string | undefined;
  source: string | undefined;
  description: string | undefined;
  creation_date: string | undefined;
  loading: boolean = true;
  currentWorkspaceId: string | undefined;

  account_name: string | undefined;

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
      this.applyFilter();
      this.loading = false;
    });
  }

  applyFilter(): void {
    if (this.activeFilter === 'Name') {
        this.ACCOUNT.sort((a: any, b: any) => a.first_name.localeCompare(b.first_name));
    } else if (this.activeFilter === 'Creation Date') {
        this.ACCOUNT.sort((a: any, b: any) => new Date(a.creation_date).getTime() - new Date(b.creation_date).getTime());
    }
}

  openNewAccountPopup(): void {
    // Open the new account popup
    const newaccountPopup = this.elementRef.nativeElement.querySelector('.create-account-pop-up');
    newaccountPopup.style.display = 'block';
  }

  closeNewAccountPopup(): void {
    // Close the new account popup
    const newaccountPopup = this.elementRef.nativeElement.querySelector('.create-account-pop-up');
    newaccountPopup.style.display = 'none';
    this.onReset();
  }

  createAccount(): void {
    let newAccount = {
      account_name: this.account_name,
      company: this.company,
      phone_number: this.phone_number,
      email: this.email,
      description: this.description,
      workspace_id: this.currentWorkspaceId
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

  previousFilter: string = 'Name';
  activeFilter: string = 'Name';

filterStatus(activeFilter: string): void {
    this.closeFilterStatusDropdown();
    if (activeFilter === this.previousFilter) {
        this.activeFilter = 'Name';
        this.previousFilter = 'Name';
    } else {
        this.activeFilter = activeFilter;
        this.previousFilter = activeFilter;
    }
    this.getAccounts();
}



  onInputChange(event: any) {
    const searchInputValue = event.target.value.trim();
    this.accountSearchInputValue = searchInputValue;
  
    if (this.accountSearchInputValue === '') {
      this.getAccounts();
    } else {
      this.ACCOUNT = this.ACCOUNT.filter((account: any) => {
        const firstName = account.first_name?.toLowerCase() ?? '';
        const lastName = account.last_name?.toLowerCase() ?? '';
        const company = account.company?.toLowerCase() ?? '';
        const phoneNumber = account.phone_number?.toLowerCase() ?? '';
        const email = account.email?.toLowerCase() ?? '';
  
        return firstName.includes(this.accountSearchInputValue.toLowerCase()) ||
          lastName.includes(this.accountSearchInputValue.toLowerCase()) ||
          company.includes(this.accountSearchInputValue.toLowerCase()) ||
          phoneNumber.includes(this.accountSearchInputValue.toLowerCase()) ||
          email.includes(this.accountSearchInputValue.toLowerCase());
        });
    }
  }  

  // CSV Exporting

  generateCSV(): string {
    let csv = 'Last Name,First Name,Company,Phone Number,Email\n';

    this.ACCOUNT.forEach((account: any) => {
      const row = `${account.last_name || ''},${account.first_name || ''},${account.company || ''},${account.phone_number || ''},${account.email || ''}, ${account.creation_date}\n`;
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
    this.first_name = undefined;
    this.last_name = undefined;
    this.company = undefined;
    this.phone_number = undefined;
    this.email = undefined;
    this.description = undefined;
    this.account_name = undefined;

    this.accountsEditMode = false;
  }

  openAccountDetailsPopUp(account: any): void {
    this.account_id = account.account_id;
    this.first_name = account.first_name;
    this.last_name = account.last_name;
    this.account_name = `${account.first_name} ${account.last_name}`;
    this.company = account.company;
    this.phone_number = account.phone_number;
    this.email = account.email;
    this.description = account.description;

    const accountDetailsPopUp = this.elementRef.nativeElement.querySelector('.account-details-pop-up');
    accountDetailsPopUp.style.display = 'block';
  }

  updateAccount(): void {
    let updatedAccount = {
      account_id: this.account_id,
      account_name: this.account_name,
      company: this.company,
      phone_number: this.phone_number,
      email: this.email,
      description: this.description
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
    this.company = '';
    this.phone_number = '';
    this.email = '';
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