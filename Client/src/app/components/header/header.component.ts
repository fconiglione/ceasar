import { Component, ElementRef } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {faBell, faGear, faQuestion, faSearch, faTimes, faUser, faArrowRight, faRightFromBracket} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import { CookieService } from 'ngx-cookie-service';
import { SearchService } from '../../services/search/search.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgOptimizedImage,
    FaIconComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private elementRef: ElementRef, private cookieService : CookieService, private searchService : SearchService ) {}
  isActive: boolean = false;
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
  protected readonly faTimes = faTimes;
  protected readonly faQuestion = faQuestion;
  protected readonly faGear = faGear;
  protected readonly faBell = faBell;
  protected readonly faUser = faUser;
  currentYear = new Date().getFullYear();

  clearSearchInput() {
    const searchInput = this.elementRef.nativeElement.querySelector('#searchInput');
    searchInput.value = '';
  }

  search(event: any) {
    event.preventDefault();
    const searchInput = this.elementRef.nativeElement.querySelector('#searchInput');
    const searchValue = searchInput.value.trim();
    if (searchValue) {
      // Send the api request to search
      this.searchService.search(searchValue).subscribe((response: any) => {
        console.log(response);
      });
      window.location.href = `/search?q=${searchValue}`;
    } else if (searchValue.length === 0) {
      console.error('Search input is empty');
      window.location.href = '/';
    } else {
      console.error('Search input is invalid');
      window.location.href = `/search?q=${searchValue}`;
    }
  }
}
