import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {faBell, faGear, faQuestion, faSearch, faTimes, faUser} from '@fortawesome/free-solid-svg-icons';
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
  appLauncherIcon = 'assets/images/app-launcher-icon.png'
  CeasarColouredLogo1 = "assets/images/ceasar-coloured-logo-1.svg";
  faSearch = faSearch;
  protected readonly faTimes = faTimes;
  protected readonly faQuestion = faQuestion;
  protected readonly faGear = faGear;
  protected readonly faBell = faBell;
  protected readonly faUser = faUser;
}
