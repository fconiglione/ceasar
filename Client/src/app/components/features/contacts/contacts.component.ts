import { Component, ElementRef } from '@angular/core';
import { faChevronDown, faSearch, faDownload, faPhone, faEnvelope, faEllipsisV, faCircleInfo, faEye, faEdit, faTrash, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../../services/contact/contact.service';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    FaIconComponent,
    NgFor, NgIf, DatePipe,
    CommonModule,
    FormsModule
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})
export class ContactsComponent {
  // Contacts card
  CONTACT: any;
  contact_id: string | undefined;
  first_name: string | undefined;
  last_name: string | undefined;
  company: string | undefined;
  phone_number: string | undefined;
  email: string | undefined;
  description: string | undefined;
  loading: boolean = true;
  currentWorkspaceId: string | undefined;

  full_name: string | undefined;

  contactSearchInputValue: string = '';
  activeFilter: string = 'Name';

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

  constructor(private contactService: ContactService, private route: ActivatedRoute, private router: Router, private elementRef: ElementRef) { }

  getContacts(): void {
    // Get contacts from the API
    this.contactService.getContacts(this.currentWorkspaceId).subscribe(response => {
      this.CONTACT = response;
      this.loading = false;
    });
  }

  openNewContactPopup(): void {
    // Open the new contact popup
    const newcontactPopup = this.elementRef.nativeElement.querySelector('.create-contact-pop-up');
    newcontactPopup.style.display = 'block';
  }

  closeNewContactPopup(): void {
    // Close the new contact popup
    const newcontactPopup = this.elementRef.nativeElement.querySelector('.create-contact-pop-up');
    newcontactPopup.style.display = 'none';
    this.onReset();
  }

  createContact(): void {
    let newcontact = {
      full_name: this.full_name,
      company: this.company,
      phone_number: this.phone_number,
      email: this.email,
      description: this.description,
      workspace_id: this.currentWorkspaceId
    };

    // this.contactService.createcontact(newcontact).subscribe(response => {
    //   console.log(response);
    //   this.getcontacts();
    //   this.closeNewcontactPopup();
    // });
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
          this.getContacts();
          this.activeFilter = 'All status';
          this.previousStatus = 0;
      } else {
          if (statusId === 0) {
            this.activeFilter = 'All status';
            this.getContacts();
          } else {
              this.contactService.getContacts(this.currentWorkspaceId).subscribe(response => {
                  this.CONTACT = response;
                  this.CONTACT = this.CONTACT.filter((contact: any) => contact.status_id === statusId);
                  this.previousStatus = statusId;
                  this.activeFilter = 'PLACEHOLDER';
              });
          }
      }
  }

  onInputChange(event: any) {
    const searchInputValue = event.target.value.trim();
    this.contactSearchInputValue = searchInputValue;
  
    if (this.contactSearchInputValue === '') {
      this.getContacts();
    } else {
      this.CONTACT = this.CONTACT.filter((contact: any) => {
        const firstName = contact.first_name?.toLowerCase() ?? '';
        const lastName = contact.last_name?.toLowerCase() ?? '';
        const company = contact.company?.toLowerCase() ?? '';
        const phoneNumber = contact.phone_number?.toLowerCase() ?? '';
        const email = contact.email?.toLowerCase() ?? '';
  
        return firstName.includes(this.contactSearchInputValue.toLowerCase()) ||
          lastName.includes(this.contactSearchInputValue.toLowerCase()) ||
          company.includes(this.contactSearchInputValue.toLowerCase()) ||
          phoneNumber.includes(this.contactSearchInputValue.toLowerCase()) ||
          email.includes(this.contactSearchInputValue.toLowerCase());
        });
    }
  }  

  // CSV Exporting

  generateCSV(): string {
    let csv = 'Last Name,First Name,Company,Phone Number,Email\n';

    this.CONTACT.forEach((contact: any) => {
      const row = `${contact.last_name || ''},${contact.first_name || ''},${contact.company || ''},${contact.phone_number || ''},${contact.email || ''}\n`;
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
    a.download = 'contacts.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  toggleContactCardDropdown(contact: any): void {
    this.CONTACT.forEach((c: any) => {
      if (c !== contact) {
        c.showSubSetting = false;
      }
    });
    contact.showSubSetting = !contact.showSubSetting;
  }

  deleteContact(contact: any): void {
    if (confirm('Are you sure you want to delete this contact?')) {
      // this.contactService.deleteContact(contact.contact_id).subscribe(response => {
      //   this.getContacts();
      // });
    }
  }

  closeContactDetailsPopUp(): void {
    const contactDetailsPopUp = this.elementRef.nativeElement.querySelector('.contact-details-pop-up');
    contactDetailsPopUp.style.display = 'none';

    this.contact_id = undefined;
    this.first_name = undefined;
    this.last_name = undefined;
    this.company = undefined;
    this.phone_number = undefined;
    this.email = undefined;
    this.description = undefined;
    this.full_name = undefined;

    this.contactsEditMode = false;
  }

  openContactDetailsPopUp(contact: any): void {
    this.contact_id = contact.contact_id;
    this.first_name = contact.first_name;
    this.last_name = contact.last_name;
    this.full_name = `${contact.first_name} ${contact.last_name}`;
    this.company = contact.company;
    this.phone_number = contact.phone_number;
    this.email = contact.email;
    this.description = contact.description;

    const contactDetailsPopUp = this.elementRef.nativeElement.querySelector('.contact-details-pop-up');
    contactDetailsPopUp.style.display = 'block';
  }

  updateContact(): void {
    let updatedContact = {
      contact_id: this.contact_id,
      full_name: this.full_name,
      company: this.company,
      phone_number: this.phone_number,
      email: this.email,
      description: this.description
    };

    // this.contactService.updateContact(updatedContact).subscribe(response => {
    //   console.log(response);
    //   this.getContacts();
    //   this.closecontactDetailsPopUp();
    // });
  }

  contactsEditMode: boolean = false;

  toggleContactsEditMode(): void {
    this.contactsEditMode = !this.contactsEditMode;
  }

  onReset(): void {
    // Reset the new contact form
    this.full_name = '';
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
        this.getContacts();
      });
    } else {
      console.log('Not a workspace path');
    }
  }

}
