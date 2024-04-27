import { Component, ElementRef } from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faEllipsisVertical, faCircleInfo, faArrowRightLong } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FaIconComponent  
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  faArrowRightLong = faArrowRightLong;
  BlankWorkspace = "assets/images/blank-workspace-img.png";
  CeasarColouredLogo2 = "assets/images/ceasar-coloured-logo-2.svg";
  faEllipsisVertical = faEllipsisVertical;
  faPlus = faPlus;
  faCircleInfo = faCircleInfo;
  tokenVerified: boolean = false;

  constructor(private elementRef: ElementRef) {}

  openCreateWorkspace() {
    const createWorkspacePopUp = this.elementRef.nativeElement.querySelector('#create-workspace-pop-up');
    createWorkspacePopUp.style.display = 'block';
  }
  closeCreateWorkspace() {
    const createWorkspacePopUp = this.elementRef.nativeElement.querySelector('#create-workspace-pop-up');
    createWorkspacePopUp.style.display = 'none';
  }
}
