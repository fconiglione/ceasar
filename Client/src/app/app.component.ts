import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from './components/header/header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from './services/auth/auth.service';
import { NgIf } from '@angular/common';
import { environment } from '../environments/environment';
import { ScreenDetectorService } from './services/screen-detector/screen-detector.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, [FontAwesomeModule], NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Client';
  faCoffee = faCoffee;
  tokenVerified: boolean = false;

  constructor( private screenDetectorService: ScreenDetectorService, private router: Router, private authService: AuthService ) { }

  ngOnInit(): void {
    this.authService.verifyJWTToken().subscribe(
      (response) => {
        console.log(response);
        this.tokenVerified = true;
      },
      (error) => {
        console.error(error);
        if (environment.production === false) {
          this.tokenVerified = true;
        } else {
          this.tokenVerified = false;
          window.location.href = 'https://www.cloud.frim.io/login';
        }
      }
    );

    this.screenDetectorService.screenSizeChanges.subscribe(isSmallScreen => {
      if (isSmallScreen) {
        window.location.href = 'https://www.frim.io/apps/ceasar/download';
      }
    });

    this.screenDetectorService.checkScreenSize();
  }
}
