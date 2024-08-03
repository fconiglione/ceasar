import { Component, ElementRef } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faChevronDown, faSearch, faDownload, faPhone, faEnvelope, faEllipsisV, faCircleInfo, faEye, faEdit, faTrash, faArrowLeft, faSort, faBars, faTableCells, faUserAlt, faArrowRightToBracket, faXmark, faPenToSquare, faSquare } from '@fortawesome/free-solid-svg-icons';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { AccountService } from '../../../services/accounts/account.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from '../../loading/loading.component';
import { AuthService } from '@auth0/auth0-angular';
import { NoDataComponent } from "../../no-data/no-data.component";

@Component({
  selector: 'app-accounts',
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
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css'
})
export class AccountsComponent {
  // User components
  username: string | undefined;

  // Account components
  ACCOUNT: any;
  sub: string | undefined;
  account_id: string | undefined;
  workspace_id: string | undefined;
  name: string | undefined;
  division: string | undefined;
  source: string | undefined;
  account_type_id: string | undefined = "";
  photo_url: string | undefined;
  phone_number: string | undefined;
  email: string | undefined;
  created_at: string | undefined;
  updated_at: string | undefined;

  // Component actions
  accounts_action_container: boolean = false;
  accounts_action_sidebar_container: boolean = false;
  account_edit_mode: boolean = false;
  loading: boolean = true;
  more_info_dropdown: boolean = false;
  card_view: boolean = true;
  list_view: boolean = false;
  sort_by_dropdown: boolean = false;
  account_action_type_menu: boolean = false;

  // Other variables
  account_type: string | undefined;
  account_count: number = 0;
  account_type_prospect_count: number = 0;
  account_type_customer_count: number = 0;
  previous_type_filter: number = 0;
  active_type_filter: number = 0;
  active_sort_factor: string = 'By Account Name';
  allAccounts: any[] = [];
  filteredAccounts: any[] = [];

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

  accountSearchInputValue: string = '';
  activeTypeFilter: string = 'All types';

  DefaultPFP = "assets/images/default-pfp.svg";

  constructor( private accountService: AccountService, private route: ActivatedRoute, private router: Router, private elementRef: ElementRef, private authService: AuthService ) { }

  getAccounts(): void {
    // Get accounts from the API
    this.accountService.getAccounts(this.currentWorkspaceId).subscribe((accounts: any) => {
      // this.filteredAccounts = response;
      this.allAccounts = accounts;
      this.filteredAccounts = accounts;
      this.countAccounts();
      this.sortAccounts('name'); // Sort by name by default
      this.loading = false;
    });
  }

  createAccount(): void {
    let newAccount = {
      sub  : this.sub,
      workspace_id : this.currentWorkspaceId,
      name : this.name,
      division: this.division,
      phone_number: this.phone_number,
      email: this.email,
      account_type_id: this.account_type_id,
      photo_url: this.photo_url,
      source: this.source,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.accountService.createAccount(newAccount).subscribe(response => {
      console.log(response);
      this.getAccounts();
      this.onReset();
    });
  }

  updateAccount(): void {
    if (confirm('Are you sure you want to make changes to this account? All changes are final and cannot be undone.')) {
      let updatedAccount = {
        account_id: this.account_id,
        name: this.name,
        division: this.division,
        phone_number: this.phone_number,
        email: this.email,
        account_type_id: this.account_type_id,
        photo_url: this.photo_url,
        source: this.source,
        updated_at: new Date().toISOString(),
        workspace_id: this.currentWorkspaceId
      };

      this.accountService.updateAccount(updatedAccount).subscribe(response => {
        console.log(response);
        this.getAccounts();
        this.onReset();
      });
    }
  }

  deleteAccount(): void {
    if (confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
      this.accountService.deleteAccount(this.account_id).subscribe(response => {
        console.log(response);
        this.getAccounts();
        this.onReset();
      });
    }
  }

  // Deletion from directly within the list
  deleteAccountById(account_id: string): void {
    if (confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
      this.accountService.deleteAccount(account_id).subscribe(response => {
        console.log(response);
        this.getAccounts();
      });
    }
  }

  getAccountType(account_type_id: any) {
    switch (account_type_id) {
      case 1:
        return 'Customer';
      case 2:
        return 'Prospect';
      default:
        return 'Not provided';
    }
  }

  getAccountTypeClasses(account_type_id: any) {
    switch (account_type_id) {
      case 1:
        return { 'account-type': true, 'customer': true };
      case 2:
        return { 'account-type': true, 'prospect': true };
      default:
        return { 'account-type': true, 'not-provided': true };
    }
  }

  onInputChange(event: any) {
    const searchInputValue = event.target.value.trim().toLowerCase();
    this.accountSearchInputValue = searchInputValue;
  
    if (this.accountSearchInputValue.length > 0) {
      this.countAccounts();
      this.filteredAccounts = this.allAccounts.filter((account: any) => {
        const name = account.name?.toLowerCase() ?? '';
        const division = account.division?.toLowerCase() ?? '';
        const phoneNumber = account.phone_number?.toLowerCase() ?? '';
        const email = account.email?.toLowerCase() ?? '';
        const type = this.getAccountType(account.account_type_id).toLowerCase();
  
        return name.includes(this.accountSearchInputValue) ||
          division.includes(this.accountSearchInputValue) ||
          phoneNumber.includes(this.accountSearchInputValue) ||
          email.includes(this.accountSearchInputValue) ||
          type.includes(this.accountSearchInputValue);
      });
    } else {
      this.countAccounts();
      this.filteredAccounts = this.allAccounts;
    }
  }

  countAccounts(): void {
    this.account_count = this.filteredAccounts.length;
    this.account_type_customer_count = this.filteredAccounts.filter((account: any) => account.account_type_id === 1).length;
    this.account_type_prospect_count = this.filteredAccounts.filter((account: any) => account.account_type_id === 2).length;
  } 
  
  filterAccountType(account_type_id: number): void {
      this.active_type_filter = account_type_id;
      if (account_type_id === this.previous_type_filter) {
          this.getAccounts();
          this.previous_type_filter = 0;
      } else {
          if (account_type_id === 0) {
            this.getAccounts();
          } else {
              this.accountService.getAccounts(this.currentWorkspaceId).subscribe(response => {
                  this.filteredAccounts = response as any[];
                  this.countAccounts();
                  this.filteredAccounts = this.filteredAccounts.filter((account: any) => account.account_type_id === account_type_id);
                  this.previous_type_filter = account_type_id;
                  this.activeTypeFilter = this.getAccountType(account_type_id);
              });
          }
      }
  }

  openAccountsActionSidebar(account: any): void {
    // Setting the account details
    this.account_id = account.account_id;
    this.name = account.name;
    this.division = account.division;
    this.phone_number = account.phone_number;
    this.email = account.email;
    this.account_type_id = account.account_type_id;
    this.photo_url = account.photo_url;
    this.source = account.source;
    this.created_at = account.created_at;
    this.updated_at = account.updated_at
    // Opening the accounts action sidebar
    // this.onReset();
    this.accounts_action_sidebar_container = true;
  }

  openAccountTypeMenu(account: any): void {
    this.account_type_id = account.account_type_id;
    this.account_id = account.account_id;
    this.name = account.name;
    this.division = account.division;
    this.phone_number = account.phone_number;
    this.email = account.email;
    this.photo_url = account.photo_url;
    this.source = account.source;
    this.account_action_type_menu = true;
  }

  updateAccountType(account_type_id: any): void {
    let updatedAccount = {
      account_type_id: account_type_id, // Take from new selected type
      account_id: this.account_id,
      name: this.name,
      division: this.division,
      phone_number: this.phone_number,
      email: this.email,
      photo_url: this.photo_url,
      source: this.source,
      updated_at: new Date().toISOString(),
      workspace_id: this.currentWorkspaceId
      };

    this.accountService.updateAccount(updatedAccount).subscribe(response => {
      console.log(response);
      this.getAccounts();
      this.onReset();
    });
  }

  sortAccounts(sortFactor: any): void {
    if (sortFactor === 'name') {
      this.filteredAccounts.sort((a: any, b: any) => {
        const nameA = a.name;
        const nameB = b.name;

        this.active_sort_factor = 'By Account Name';

        return nameA.localeCompare(nameB);
      });
    }

    if (sortFactor === 'type') {
      this.filteredAccounts.sort((a: any, b: any) => {
        const typeA = a.account_type_id;
        const typeB = b.account_type_id;

        this.active_sort_factor = 'By Type';

        return typeA - typeB;
      });
    }

    if (sortFactor === 'created_at') {
      this.filteredAccounts.sort((a: any, b: any) => {
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
    let csv = 'Name, Division, Phone Number, Email, Account Type, Source, Owner\n';

    this.filteredAccounts.forEach((account: any) => {
      csv += `${account.name},${account.division}, ${account.phone_number}, ${account.email}, ${this.getAccountType(account.account_type_id)}, ${account.source}, ${account.owner}\n`;
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

  printData(): void {
    // Print in csv format
    const csvData = this.generateCSV();
    const printWindow = window.open('', '', 'height=400,width=800');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Accounts</title>');
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
    // Reset the new account form
    this.name = '';
    this.division = '';
    this.phone_number = '';
    this.email = '';
    this.account_type_id = '';
    this.photo_url = '';
    this.source = '';
    this.created_at = '';
    this.updated_at = '';

    // Close any open components
    this.accounts_action_sidebar_container = false;
    this.accounts_action_container = false
    this.account_edit_mode = false;
    this.account_action_type_menu = false;
    this.more_info_dropdown = false;
    this.filterAccountType(0);
    this.getAccounts();
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
            this.getAccounts();
          });
        }
      });
    } else {
      console.log('Not a workspace path');
    }
  }
}