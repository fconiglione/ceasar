import { Component } from '@angular/core';
import {faArrowRightLong} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

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

  protected readonly faArrowRightLong = faArrowRightLong;
  BlankWorkspace = "assets/images/blank-workspace-img.png";
}
