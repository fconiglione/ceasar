import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from './components/header/header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '@auth0/auth0-angular';
import { NgIf } from '@angular/common';
import { environment } from '../environments/environment';
import { ScreenDetectorService } from './services/screen-detector/screen-detector.service';
import { Router } from '@angular/router';
import { LoadingComponent } from './components/loading/loading.component';
import { LoginComponent } from './components/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, [FontAwesomeModule], NgIf, LoadingComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Client';
  faCoffee = faCoffee;
  isAuthenticated = false;
  isSmallScreen = false;

  constructor( private screenDetectorService: ScreenDetectorService, private router: Router, private authService: AuthService ) { }

  ngOnInit(): void {
    this.screenDetectorService.screenSizeChanges.subscribe(isSmallScreen => {
      if (isSmallScreen) {
        this.isSmallScreen = true;
        window.location.href = 'https://www.frim.io/apps/ceasar/download';
      }
    });

    this.screenDetectorService.checkScreenSize();

    this.authService.isAuthenticated$.subscribe(
      (authenticated: boolean) => {
        this.isAuthenticated = authenticated;
      }
    );

  }
}
