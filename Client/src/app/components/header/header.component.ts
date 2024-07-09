import { Component, ElementRef } from '@angular/core';
import { AsyncPipe, NgOptimizedImage, NgIf, NgFor, NgStyle } from "@angular/common";
import { faBell, faGear, faQuestion, faSearch, faTimes, faUser, faArrowRight, faRightFromBracket, faChevronRight, faChevronDown, faHome, faPlus, faCircleInfo, faSliders, faXmark, faPen } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkspaceService } from '../../services/workspace/workspace.service';
import { FormsModule } from '@angular/forms';
import { FeatureService } from '../../services/feature/feature.service';
import { AuthService } from '@auth0/auth0-angular';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgOptimizedImage,
    FaIconComponent,
    NgIf,
    NgFor,
    FormsModule,
    NgStyle, AsyncPipe
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {
  // User variables
  user: any;
  sub: string | undefined;
  nickname: string | undefined;
  name: string | undefined;
  picture: string | undefined;
  updated_at: string | undefined;

  WORKSPACE: any;
  workspace_id: string | undefined;
  title: string | undefined;
  description: string | undefined;
  // Features present
  has_leads!: boolean | false;
  has_accounts!: boolean | false;
  has_opportunities!: boolean | false;
  has_contacts!: boolean | false;
  has_files!: boolean | false;
  has_reports!: boolean | false;

  // Features active
  home: boolean = false;
  leads: boolean = false;
  accounts: boolean = false;
  opportunities: boolean = false;
  contacts: boolean = false;
  files: boolean = false;
  reports: boolean = false;

  // Boolean elements
  workspace_setup: boolean = false;
  workspace_title_edit: boolean = false;

  constructor(private elementRef: ElementRef, private cookieService : CookieService, private router: Router, private workspaceService: WorkspaceService, private route: ActivatedRoute, public featureService: FeatureService, public authService: AuthService, private userService: UserService ) {}
  isActive: boolean = false;

  getWorkspaces(): void {
    this.workspaceService.getWorkspaces(this.sub).subscribe(response => {
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
  faCircleInfo = faCircleInfo;
  faSliders = faSliders;
  protected readonly faTimes = faTimes;
  protected readonly faQuestion = faQuestion;
  protected readonly faGear = faGear;
  protected readonly faBell = faBell;
  protected readonly faUser = faUser;
  currentYear = new Date().getFullYear();
  searchInputValue: string = '';
  currentWorkspaceId: string = '';
  workspaceDropdown: boolean = false;
  workspaceFeaturesDropdown: boolean = false;
  faXmark = faXmark;
  faPen = faPen;

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
    this.workspaceService.getWorkspaceByWorkspaceId(this.sub, this.currentWorkspaceId).subscribe(response => {
      this.title = response || 'Untitled workspace';
    });
  }  

  getWorkspaceTitleById(workspaceId: string): string {
    const workspace = this.WORKSPACE.find((ws: any) => ws.workspace_id === workspaceId);
    return workspace ? workspace.title || 'Untitled workspace' : 'Untitled workspace';
  } 
  
  redirectToSelectedWorkspace(workspaceId: string) {
    this.router.navigate(['/ws'], { queryParams: { workspace_id: workspaceId } });
  }

  refreshWorkspace() {
    this.getWorkspaceFeatures(this.currentWorkspaceId);
    this.workspace_setup = false;
    this.workspace_title_edit = false;
  }  

  toggleTitleWorkspaceEdit() {
    this.workspace_title_edit = !this.workspace_title_edit;
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
    if (this.sub) {
    this.workspaceService.getWorkspaceFeatures(this.sub, workspaceId).subscribe((response: any) => {
      this.has_leads = response.has_leads;
      this.has_accounts = response.has_accounts;
      this.has_opportunities = response.has_opportunities;
      this.has_contacts = response.has_contacts;
      this.has_files = response.has_files;
      this.has_reports = response.has_reports;
    });
  }
  }

  updateWorkspace() {
    this.workspaceService.updateWorkspace(this.sub, this.currentWorkspaceId, this.title).subscribe(response => {
    });
    this.workspaceService.updateWorkspaceFeatures(this.sub, this.currentWorkspaceId, this.has_leads, this.has_accounts, this.has_opportunities, this.has_contacts, this.has_files, this.has_reports)
      .subscribe(response => {
        console.log(response);
      }, error => {
        console.error(error);
      });

      this.refreshWorkspace(); 
      this.setDefaultWorkspace();
      this.getWorkspaces();    
  }

  registerUser() {
    let user = {
      sub: this.sub,
      nickname: this.nickname,
      name: this.name,
      picture: this.picture,
      updated_at: this.updated_at
    };
    this.userService.registerUser(user).subscribe((response: any) => {
      console.log(response);
    });
  }
  
  ngOnInit() {
    if (this.isWorkspacePath()) {
      this.authService.user$.subscribe(user => {
        if (user && user.sub) {
          this.sub = user.sub;
          this.nickname = user.nickname;
          this.name = user.name;
          this.picture = user.picture;
          this.updated_at = user.updated_at;
          this.route.queryParams.subscribe(params => {
            this.currentWorkspaceId = params['workspace_id'] || '';
            this.getWorkspaceFeatures(this.currentWorkspaceId);
            this.setDefaultWorkspace();
            this.getWorkspaces();
            this.featureService.setActiveFeature('home');
          });
        }
      });
    } else {
      this.getWorkspaces();
    }
  }  

  ngAfterViewInit() {
    this.featureService.setActiveFeature('home'); // Adding default active feature to home
  }
}
