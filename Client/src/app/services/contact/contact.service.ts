import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  appServerUrl = environment.appServerUrl;

  constructor( private httpClient: HttpClient ) { }

  getContacts(workspaceId: any) {
    return this.httpClient.post(`${this.appServerUrl}/features/contacts`, {workspaceId});
  }
}
