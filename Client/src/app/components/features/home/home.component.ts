import { Component } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faCircleRight, faUsers, faBuilding, faHandshake, faAddressBook } from "@fortawesome/free-solid-svg-icons";

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

  faCircleRight = faCircleRight;
  faUsers = faUsers;
  faBuilding = faBuilding;
  faHandshake = faHandshake;
  faAddressBook = faAddressBook;

}
