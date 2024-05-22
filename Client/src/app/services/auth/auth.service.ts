import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  cloudServerUrl = environment.cloudServerUrl;
  appServerUrl = environment.appServerUrl;

  constructor( private http: HttpClient, private cookieService: CookieService ) { }

  verifyJWTToken() {
    if (environment.production === false) {
      const token_id = environment.adminTokenId;
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      return this.http.post(`${this.cloudServerUrl}/users/admin-verify-session`, { token_id }, {headers, withCredentials: true});
    } else {
      // Setting the headers
      const token = this.cookieService.get('token');
      const user_id = this.cookieService.get('user_id');
      this.cookieService.set('token', token);
      this.cookieService.set('user_id', user_id);
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      return this.http.post(`${this.cloudServerUrl}/users/verify-session`, { token, user_id }, {headers, withCredentials: true});
    }
  }

  getUserDetails() {
    if (environment.production === false) {
      const token_id = environment.adminTokenId;
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      return this.http.post(`${this.appServerUrl}/users/admin-token-details`, { token_id }, {headers, withCredentials: true});
    } else {
      // Setting the headers
      const token = this.cookieService.get('token');
      const user_id = this.cookieService.get('user_id');
      this.cookieService.set('token', token);
      this.cookieService.set('user_id', user_id);
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      return this.http.post(`${this.appServerUrl}/users/token-details`, {token, user_id}, {headers, withCredentials: true});
    }
  }

}