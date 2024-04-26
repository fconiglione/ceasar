import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  cloudServerUrl = environment.cloudServerUrl;

  constructor( private http: HttpClient, private cookieService: CookieService ) { }

  verifyJWTToken() {
    const token_id = this.cookieService.get('token_id');
    return this.http.post(`${this.cloudServerUrl}/users/verify-session`, { token_id });
  }

}
