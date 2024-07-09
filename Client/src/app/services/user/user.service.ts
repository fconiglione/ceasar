import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  cloudServerUrl = environment.cloudServerUrl;

  constructor( private http: HttpClient ) { }

  registerUser(user: any) {
    return this.http.post(`${this.cloudServerUrl}/users/auth/callback`, user);
  }
}
