import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  appServerUrl = environment.appServerUrl;

  constructor( private http: HttpClient, private authService : AuthService ) { }

  search(searchTerm: any) {
    return this.authService.getUserDetails().pipe(
      switchMap((userDetails: any) => {
        const user_id = userDetails.user_id;
        return this.http.post(`${this.appServerUrl}/search`, { searchTerm, user_id });
      })
    );
  }  
}
