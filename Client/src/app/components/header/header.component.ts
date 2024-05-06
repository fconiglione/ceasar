import { Component, ElementRef } from '@angular/core';
import { NgOptimizedImage, NgIf, NgFor, NgStyle } from "@angular/common";
import { faBell, faGear, faQuestion, faSearch, faTimes, faUser, faArrowRight, faRightFromBracket, faChevronRight, faChevronDown, faHome, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkspaceService } from '../../services/workspace/workspace.service';
import { FormsModule } from '@angular/forms';
import { FeatureService } from '../../services/feature/feature.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgOptimizedImage,
    FaIconComponent,
    NgIf,
    NgFor,
    FormsModule,
    NgStyle
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {
  WORKSPACE: any;
  workspace_id: string | undefined;
  title: string | undefined;
  description: string | undefined;
  // Features present
  has_leads: boolean | undefined;
  has_accounts: boolean | undefined;
  has_opportunities: boolean | undefined;
  has_contacts: boolean | undefined;
  has_files: boolean | undefined;
  has_reports: boolean | undefined;

  // Features active
  home: boolean = false;
  leads: boolean = false;
  accounts: boolean = false;
  opportunities: boolean = false;
  contacts: boolean = false;
  files: boolean = false;
  reports: boolean = false;

  constructor(private elementRef: ElementRef, private cookieService : CookieService, private router: Router, private workspaceService: WorkspaceService, private route: ActivatedRoute, public featureService: FeatureService ) {}
  isActive: boolean = false;

  getWorkspaces(): void {
    this.workspaceService.getWorkspaces().subscribe(response => {
      this.WORKSPACE = response;
    });
  }

  openAppLauncher() {
    this.isActive = true;

    const overlay = this.elementRef.nativeElement.querySelector('#overlay');
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  closeAppLauncher() {
    this.isActive = false;

    const overlay = this.elementRef.nativeElement.querySelector('#overlay');
    overlay.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
  logoutUser() {
    sessionStorage.clear();
    this.cookieService.delete('token_id');
    window.location.href = 'https://www.cloud.frim.io/login';
  }
  appLauncherIcon = 'assets/images/app-launcher-icon.png'
  CeasarColouredLogo1 = "assets/images/ceasar-coloured-logo-1.svg";
  CeasarColouredLogo2 = "assets/images/ceasar-coloured-logo-2.svg";
  faSearch = faSearch;
  faArrowRight = faArrowRight;
  faRightFromBracket = faRightFromBracket;
  faChevronRight = faChevronRight;
  faChevronDown = faChevronDown;
  faHome = faHome;
  faPlus = faPlus;
  protected readonly faTimes = faTimes;
  protected readonly faQuestion = faQuestion;
  protected readonly faGear = faGear;
  protected readonly faBell = faBell;
  protected readonly faUser = faUser;
  currentYear = new Date().getFullYear();
  searchInputValue: string = '';
  currentWorkspaceId: string = '';
  selectedWorkspace: string = '';
  workspaceDropdown: boolean = false;

  clearSearchInput() {
    const searchInput = this.elementRef.nativeElement.querySelector('#searchInput');
    searchInput.value = '';
  }

  search(event: any) {
    event.preventDefault();
    let searchInput = this.elementRef.nativeElement.querySelector('#searchInput');
    let searchValue = searchInput.value.trim();
    if (searchValue) {
        window.location.href = `/search?q=${searchValue}`;
    } else if (searchValue.length === 0) {
      console.error('Search input is empty');
      window.location.href = '/';
    } else {
      console.error('Search input is invalid');
      window.location.href = `/search?q=${searchValue}`;
    }
  }
  launchMobileSearch() {
    const nonMobileColumns = this.elementRef.nativeElement.querySelectorAll('.non-mobile-column');
    nonMobileColumns.forEach((element: HTMLElement) => {
      element.style.display = 'none';
    });
    document.body.style.overflow = 'hidden';

    const headerSearchBar = this.elementRef.nativeElement.querySelector('.header-search-bar');
    headerSearchBar.style.display = 'flex';
    const closeMobileMenuBtn = this.elementRef.nativeElement.querySelector('.close-mobile-search');
    closeMobileMenuBtn.style.display = 'flex';
  }
  closeMobileSearch() {
    const nonMobileColumns = this.elementRef.nativeElement.querySelectorAll('.non-mobile-column');
    nonMobileColumns.forEach((element: HTMLElement) => {
      element.style.display = 'flex';
    });
    document.body.style.overflow = 'auto';

    const headerSearchBar = this.elementRef.nativeElement.querySelector('.header-search-bar');
    headerSearchBar.style.display = 'none';
    const closeMobileMenuBtn = this.elementRef.nativeElement.querySelector('.close-mobile-search');
    closeMobileMenuBtn.style.display = 'none';
  }
  isWorkspacePath(): boolean {
    return this.router.url.startsWith('/ws');
  }

  onInputChange() {
    const searchInput = this.elementRef.nativeElement.querySelector('#searchInput');
    this.searchInputValue = searchInput.value.trim();
  }

  setDefaultWorkspace() {
      this.workspaceService.getWorkspaceByWorkspaceId(this.currentWorkspaceId).subscribe(response => {
        this.selectedWorkspace = response || 'Untitled workspace';
      });
  }   

  getWorkspaceTitleById(workspaceId: string): string {
    const workspace = this.WORKSPACE.find((ws: any) => ws.workspace_id === workspaceId);
    return workspace ? workspace.title || 'Untitled workspace' : 'Untitled workspace';
  } 
  
  redirectToSelectedWorkspace(workspaceId: string) {
    this.router.navigate(['/ws'], { queryParams: { workspace_id: workspaceId } });
  }

  openWorkspaceDropdown() {
    this.workspaceDropdown = !this.workspaceDropdown;
    const workspaceDropdown = this.elementRef.nativeElement.querySelector('.workspace-selector-dropdown');
    if (this.workspaceDropdown) {
        workspaceDropdown.style.display = 'flex';
    } else {
        workspaceDropdown.style.display = 'none';
    }
  }
  closeWorkspaceDropdown() {
    const workspaceDropdown = this.elementRef.nativeElement.querySelector('.workspace-selector-dropdown');
    workspaceDropdown.style.display = 'none';
  } 

  getWorkspaceFeatures(workspaceId: string) {
    this.workspaceService.getWorkspaceFeatures(workspaceId).subscribe((response: any) => {
      this.has_leads = response.has_leads;
      this.has_accounts = response.has_accounts;
      this.has_opportunities = response.has_opportunities;
      this.has_contacts = response.has_contacts;
      this.has_files = response.has_files;
      this.has_reports = response.has_reports;
    });
  }

  updateWorkspaceFeatures() {
    this.workspaceService.updateWorkspaceFeatures(this.currentWorkspaceId, this.has_leads, this.has_accounts, this.has_opportunities, this.has_contacts, this.has_files, this.has_reports)
      .subscribe(response => {
        console.log(response);
      }, error => {
        console.error(error);
      });
  }
  
  
  ngOnInit() {
    if (this.isWorkspacePath()) {
      this.route.queryParams.subscribe(params => {
        this.currentWorkspaceId = params['workspace_id'] || '';
        this.getWorkspaceFeatures(this.currentWorkspaceId);
        this.setDefaultWorkspace();
        this.getWorkspaces();
        this.featureService.setActiveFeature('home');
      });
    } else {
      this.getWorkspaces();
    }
  }

  ngAfterViewInit() {
    this.featureService.setActiveFeature('home'); // Adding default active feature to home
  }
}
