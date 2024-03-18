import { Component, ElementRef } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {faBell, faGear, faQuestion, faSearch, faTimes, faUser, faArrowRight} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

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
  constructor(private elementRef: ElementRef) {}
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
  appLauncherIcon = 'assets/images/app-launcher-icon.png'
  CeasarColouredLogo1 = "assets/images/ceasar-coloured-logo-1.svg";
  CeasarColouredLogo2 = "assets/images/ceasar-coloured-logo-2.svg";
  faSearch = faSearch;
  faArrowRight = faArrowRight;
  protected readonly faTimes = faTimes;
  protected readonly faQuestion = faQuestion;
  protected readonly faGear = faGear;
  protected readonly faBell = faBell;
  protected readonly faUser = faUser;
  currentYear = new Date().getFullYear();
}
