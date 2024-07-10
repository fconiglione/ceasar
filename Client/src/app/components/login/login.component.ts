import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    LoadingComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (!user || !user.sub) {
        this.authService.loginWithRedirect();
      }
    });
  }

}
