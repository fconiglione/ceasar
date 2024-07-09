import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  appServerUrl = environment.appServerUrl;

  constructor( private http: HttpClient ) { }

  search(sub: any, searchTerm: any) {
        return this.http.post(`${this.appServerUrl}/search`, { searchTerm, sub });
  }  
}
