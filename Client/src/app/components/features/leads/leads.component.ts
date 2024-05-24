import { Component } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faChevronDown, faSearch, faDownload } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [
    FaIconComponent
  ],
  templateUrl: './leads.component.html',
  styleUrl: './leads.component.css'
})
export class LeadsComponent {
  faChevronDown = faChevronDown;
  faSearch = faSearch;
  faDownload = faDownload;
  constructor() { }
}
