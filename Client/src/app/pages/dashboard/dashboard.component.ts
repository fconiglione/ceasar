import { Component, OnInit } from '@angular/core';
import {faArrowRightLong} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faEllipsisVertical} from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FaIconComponent,
    NgIf
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  protected readonly faArrowRightLong = faArrowRightLong;
  BlankWorkspace = "assets/images/blank-workspace-img.png";
  CeasarColouredLogo2 = "assets/images/ceasar-coloured-logo-2.svg";
  faEllipsisVertical = faEllipsisVertical;
  faPlus = faPlus;
  tokenVerified: boolean = false;

  constructor( private authService: AuthService ) { }

  ngOnInit(): void {
    this.authService.verifyJWTToken().subscribe(
      (response) => {
        console.log(response);
        this.tokenVerified = true;
      },
      (error) => {
        console.error(error);
        this.tokenVerified = false;
      }
    );
  }
}
