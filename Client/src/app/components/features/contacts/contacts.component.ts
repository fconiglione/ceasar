import { Component, ElementRef } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faChevronDown, faSearch, faDownload, faPhone, faEnvelope, faEllipsisV, faCircleInfo, faEye, faEdit, faTrash, faArrowLeft, faSort, faBars, faTableCells, faUserAlt, faArrowRightToBracket, faXmark, faPenToSquare, faSquare } from '@fortawesome/free-solid-svg-icons';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { ContactService } from '../../../services/contact/contact.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from '../../loading/loading.component';
import { AuthService } from '@auth0/auth0-angular';
import { NoDataComponent } from "../../no-data/no-data.component";
import { AccountService } from '../../../services/accounts/account.service';

@Component({
  selector: 'app-contacts',
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
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})
export class ContactsComponent {
  // User components
  username: string | undefined;

  // Contact components
  CONTACT: any;
  sub: string | undefined;
  contact_id: string | undefined;
  workspace_id: string | undefined;
  account_id: string | undefined;
  title: string | undefined = '';
  first_name: string | undefined;
  last_name: string | undefined;
  nickname: string | undefined;
  photo_url: string | undefined;
  phone_number: string | undefined;
  email: string | undefined;
  street_number: string | undefined;
  street_name: string | undefined;
  city: string | undefined;
  state: string | undefined;
  postal_code: string | undefined;
  country: string | undefined = '';
  priority: boolean = false;
  created_at: string | undefined;
  updated_at: string | undefined;

  // Account Declarations
  ACCOUNT: any;
  name: string | undefined;

  // Component actions
  contacts_action_container: boolean = false;
  contacts_action_sidebar_container: boolean = false;
  contact_edit_mode: boolean = false;
  loading: boolean = true;
  more_info_dropdown: boolean = false;
  card_view: boolean = true;
  list_view: boolean = false;
  sort_by_dropdown: boolean = false;

  // Other variables
  contact_type: string | undefined;
  contact_count: number = 0;
  contact_high_priority_count: number = 0;
  previous_priority_filter: boolean = false;
  active_priority_filter: boolean = false;
  active_sort_factor: string = 'By Last Name';
  allContacts: any[] = [];
  filteredContacts: any[] = [];
  street_address: string | undefined;

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
  
// Define all countries in an array
  countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 
  'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 
  'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 
  'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 
  'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo, Democratic Republic of the', 
  'Congo, Republic of the', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 
  'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 
  'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 
  'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 
  'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 
  'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 
  'Kenya', 'Kiribati', 'Korea, North', 'Korea, South', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 
  'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 
  'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 
  'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 
  'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 
  'Niger', 'Nigeria', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 
  'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 
  'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 
  'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 
  'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 
  'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 
  'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 
  'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 
  'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 
  'Yemen', 'Zambia', 'Zimbabwe'
  ];

  currentWorkspaceId: string | undefined;

  contactSearchInputValue: string = '';
  activeTypeFilter: string = 'All types';

  DefaultPFP = "assets/images/default-pfp.svg";

  constructor( private contactService: ContactService, private route: ActivatedRoute, private router: Router, private elementRef: ElementRef, private authService: AuthService, private accountService: AccountService ) { }

  getContacts(): void {
    // Get contacts from the API
    this.contactService.getContacts(this.currentWorkspaceId).subscribe((contacts: any) => {
      // this.filteredContacts = response;
      this.allContacts = contacts;
      this.filteredContacts = contacts;
      this.countContacts();
      this.sortContacts('last_name'); // Sort by last name by default
      this.loading = false;
    });
  }

  parseStreetAddress(street_address: string | undefined): void {
      if (street_address) {
        const addressParts = street_address.split(' ');
        this.street_number = addressParts[0];
        this.street_name = addressParts.slice(1).join(' ');
      } else {
        this.street_number = '';
        this.street_name = '';
      }
    }

  createContact(): void {
    this.parseStreetAddress(this.street_address); // Parse the street address
    let newContact = {
      sub  : this.sub,
      workspace_id : this.currentWorkspaceId,
      account_id : this.account_id,
      title : this.title,
      first_name: this.first_name,
      last_name: this.last_name,
      nickname: this.nickname,
      phone_number: this.phone_number,
      email: this.email,
      photo_url: this.photo_url,
      street_number: this.street_number,
      street_name: this.street_name,
      city: this.city,
      state: this.state,
      postal_code: this.postal_code,
      country: this.country,
      priority: this.priority,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.contactService.createContact(newContact).subscribe(response => {
      console.log(response);
      this.getContacts();
      this.onReset();
    });
  }

  updateContact(): void {
    if (confirm('Are you sure you want to make changes to this contact? All changes are final and cannot be undone.')) {
      let updatedContact = {
        contact_id: this.contact_id,
        account_id: this.account_id,
        title: this.title,
        first_name: this.first_name,
        last_name: this.last_name,
        nickname: this.nickname,
        phone_number: this.phone_number,
        email: this.email,
        photo_url: this.photo_url,
        street_number: this.street_number,
        street_name: this.street_name,
        city: this.city,
        state: this.state,
        postal_code: this.postal_code,
        country: this.country,
        priority: this.priority,
        updated_at: new Date().toISOString(),
        workspace_id: this.currentWorkspaceId
      };

      this.contactService.updateContact(updatedContact).subscribe(response => {
        console.log(response);
        this.getContacts();
        this.onReset();
      });
    }
  }

  deleteContact(): void {
    if (confirm('Are you sure you want to delete this contact? This action cannot be undone.')) {
      this.contactService.deleteContact(this.contact_id).subscribe(response => {
        console.log(response);
        this.getContacts();
        this.onReset();
      });
    }
  }

  // Deletion from directly within the list
  deleteContactById(contact_id: string): void {
    if (confirm('Are you sure you want to delete this contact? This action cannot be undone.')) {
      this.contactService.deleteContact(contact_id).subscribe(response => {
        console.log(response);
        this.getContacts();
      });
    }
  }

  onInputChange(event: any) {
    const searchInputValue = event.target.value.trim().toLowerCase();
    this.contactSearchInputValue = searchInputValue;
  
    if (this.contactSearchInputValue.length > 0) {
      this.countContacts();
      this.filteredContacts = this.allContacts.filter((contact: any) => {
        const name = contact.name?.toLowerCase() ?? '';
        const nickname = contact.nickname?.toLowerCase() ?? '';
        const phoneNumber = contact.phone_number?.toLowerCase() ?? '';
        const email = contact.email?.toLowerCase() ?? '';
  
        return name.includes(this.contactSearchInputValue) ||
          nickname.includes(this.contactSearchInputValue) ||
          phoneNumber.includes(this.contactSearchInputValue) ||
          email.includes(this.contactSearchInputValue);
      });
    } else {
      this.countContacts();
      this.filteredContacts = this.allContacts;
    }
  }

  countContacts(): void {
    this.contact_count = this.filteredContacts.length;
    this.contact_high_priority_count = this.filteredContacts.filter((contact: any) => contact.priority === true).length;
  } 

filterContactPriority(priority: boolean): void {
  if (priority === this.previous_priority_filter) {
    this.getContacts();
  } else {
    if (priority === false) {
      this.active_priority_filter = false;
      this.previous_priority_filter = false;
      this.getContacts();
    } else {
      this.contactService.getContacts(this.currentWorkspaceId).subscribe(response => {
        this.filteredContacts = response as any[];
        this.countContacts();
        this.filteredContacts = this.filteredContacts.filter((contact: any) => contact.priority === priority);
        this.previous_priority_filter = true;
        this.active_priority_filter = true;
      });
    }
  }
}

  openContactsActionSidebar(contact: any): void {
    // Setting the contact details
    this.contact_id = contact.contact_id;
    this.account_id = contact.account_id;
    this.title = contact.title;
    this.nickname = contact.nickname;
    this.first_name = contact.first_name;
    this.last_name = contact.last_name;
    this.phone_number = contact.phone_number;
    this.email = contact.email;
    this.photo_url = contact.photo_url;
    this.street_number = contact.street_number;
    this.street_name = contact.street_name;
    this.city = contact.city;
    this.state = contact.state;
    this.postal_code = contact.postal_code;
    this.country = contact.country;
    this.priority = contact.priority;
    this.created_at = contact.created_at;
    this.updated_at = contact.updated_at
    // Opening the contacts action sidebar
    // this.onReset();
    this.contacts_action_sidebar_container = true;
  }

  sortContacts(sortFactor: any): void {
    if (sortFactor === 'first_name') {
      this.filteredContacts.sort((a: any, b: any) => {
        const nameA = a.first_name.toUpperCase();
        const nameB = b.first_name.toUpperCase();

        this.active_sort_factor = 'By First Name';

        return nameA.localeCompare(nameB);
      });
    }

    if (sortFactor === 'last_name') {
      this.filteredContacts.sort((a: any, b: any) => {
        const nameA = a.last_name.toUpperCase();
        const nameB = b.last_name.toUpperCase();

        this.active_sort_factor = 'By Last Name';

        return nameA.localeCompare(nameB);
      });
    }

    if (sortFactor === 'priority') {
      this.filteredContacts.sort((a: any, b: any) => {
        const priorityA = a.priority;
        const priorityB = b.priority;

        this.active_sort_factor = 'By Priority';

        return priorityB - priorityA;
      });
    }

    if (sortFactor === 'created_at') {
      this.filteredContacts.sort((a: any, b: any) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);

        this.active_sort_factor = 'By Creation Date';

        return dateB.getTime() - dateA.getTime();
      });
    }

    this.sort_by_dropdown = false;
  }

  // CSV Exporting

  generateCSV(): string {
    let csv = 'Name, nickname, Phone Number, Email, Contact Type, Source, Owner\n';

    this.filteredContacts.forEach((contact: any) => {
      csv += `${contact.name},${contact.nickname}, ${contact.phone_number}, ${contact.email}, ${contact.source}, ${contact.owner}\n`;
    });

    return csv;
  }

  downloadCSV(): void {
    const csvData = this.generateCSV();
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contacts.csv';
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
      printWindow.document.write('<html><head><title>Contacts</title>');
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

  // Get accounts
  getAccounts(): void {
    this.accountService.getAccounts(this.currentWorkspaceId).subscribe((accounts: any) => {
      this.ACCOUNT = accounts;
    });
  }

  onReset(): void {
    // Reset the new contact form
    this.title = '';
    this.nickname = '';
    this.first_name = '';
    this.last_name = '';
    this.phone_number = '';
    this.email = '';
    this.photo_url = '';
    this.street_number = '';
    this.street_name = '';
    this.street_address = '';
    this.city = '';
    this.state = '';
    this.postal_code = '';
    this.country = '';
    this.priority = false;
    this.created_at = '';
    this.updated_at = '';
    this.account_id = undefined;

    // Close any open components
    this.contacts_action_sidebar_container = false;
    this.contacts_action_container = false
    this.contact_edit_mode = false;
    this.more_info_dropdown = false;
    this.filterContactPriority(false);
    this.getContacts();
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
            this.getContacts();
            this.getAccounts();
          });
        }
      });
    } else {
      console.log('Not a workspace path');
    }
  }
}