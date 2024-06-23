import { Component } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faCircleRight, faUsers, faBuilding, faHandshake, faAddressBook } from "@fortawesome/free-solid-svg-icons";
import { HomeService } from '../../../services/home/home.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FaIconComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor( private homeService : HomeService, private route: ActivatedRoute, private router: Router ) {}

  faCircleRight = faCircleRight;
  faUsers = faUsers;
  faBuilding = faBuilding;
  faHandshake = faHandshake;
  faAddressBook = faAddressBook;

  currentWorkspaceId: string | undefined;
  leadsCount: number | undefined;
  accountsCount: number | undefined;
  opportunitiesCount: number | undefined;
  contactsCount: number | undefined;

  getLeadsCount() {
    this.homeService.getNumberOfActiveLeads(this.currentWorkspaceId).subscribe((data: any) => {
      this.leadsCount = data;
      return data;
    });
  }

  getAccountsCount() {
    this.homeService.getNumberOfOpenAccounts(this.currentWorkspaceId).subscribe((data: any) => {
      this.accountsCount = data;
      return data;
    });
  }

  getOpportunitiesCount() {
    this.homeService.getNumberOfActiveOpportunities(this.currentWorkspaceId).subscribe((data: any) => {
      this.opportunitiesCount = data;
      return data;
    });
  }

  getContactsCount() {
    this.homeService.getNumberOfContacts(this.currentWorkspaceId).subscribe((data: any) => {
      this.contactsCount = data;
      return data;
    });
  }

  isWorkspacePath(): boolean {
    return this.router.url.startsWith('/ws');
  }

  ngOnInit() {
    if (this.isWorkspacePath()) {
      this.route.queryParams.subscribe(params => {
        this.currentWorkspaceId = params['workspace_id'] || '';
        this.getLeadsCount();
        this.getAccountsCount();
        this.getOpportunitiesCount();
        this.getContactsCount();
      });
    } else {
      console.log('Not a workspace path');
    }
  }

}
