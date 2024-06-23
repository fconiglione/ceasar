import { Component } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faCircleRight, faUsers, faBuilding, faHandshake, faAddressBook } from "@fortawesome/free-solid-svg-icons";
import { HomeService } from '../../../services/home/home.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FeatureService } from '../../../services/feature/feature.service';

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

  constructor( private homeService : HomeService, private route: ActivatedRoute, private router: Router, private featureService: FeatureService ) {}

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

  home: boolean = true;
  leads: boolean = false;
  accounts: boolean = false;
  opportunities: boolean = false;
  contacts: boolean = false;
  files: boolean = false;
  reports: boolean = false;

  valueIndicatorImg = 'assets/images/value-indicator.svg';

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

  estimatedValue: number | undefined;

  getEstimatedValue() {
    this.homeService.getEstimatedValue(this.currentWorkspaceId).subscribe((data: any) => {
      this.estimatedValue = data;
      return data;
    });
  }

  switchView(view: string) {
    switch (view) {
      case 'leads':
        this.featureService.home = false;
        this.featureService.leads = true;
        break;
      case 'accounts':
        this.featureService.home = false;
        this.featureService.accounts = true;
        break;
      case 'opportunities':
        this.featureService.home = false;
        this.featureService.opportunities = true;
        break;
      case 'contacts':
        this.featureService.home = false;
        this.featureService.contacts = true;
        break;
      case 'files':
        this.featureService.home = false;
        this.featureService.files = true;
        break;
      case 'reports':
        this.featureService.home = false;
        this.featureService.reports = true;
        break;
      default:
        this.featureService.home = true;
        break;
    }
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
        this.getEstimatedValue();
      });
    } else {
      console.log('Not a workspace path');
    }
  }

}
