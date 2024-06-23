import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  appServerUrl = environment.appServerUrl;

  constructor( private httpClient: HttpClient ) { }

  getNumberOfActiveLeads(workspaceId: any) {
    return this.httpClient.post(`${this.appServerUrl}/features/home/leads`, {workspaceId});
  }

  getNumberOfOpenAccounts(workspaceId: any) {
    return this.httpClient.post(`${this.appServerUrl}/features/home/accounts`, {workspaceId});
  }

  getNumberOfActiveOpportunities(workspaceId: any) {
    return this.httpClient.post(`${this.appServerUrl}/features/home/opportunities`, {workspaceId});
  }

  getNumberOfContacts(workspaceId: any) {
    return this.httpClient.post(`${this.appServerUrl}/features/home/contacts`, {workspaceId});
  }

  getEstimatedValue(workspaceId: any) {
    return this.httpClient.post(`${this.appServerUrl}/features/home/estimated-value`, {workspaceId});
  }
}
