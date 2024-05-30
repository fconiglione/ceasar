import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LeadService {

  appServerUrl = environment.appServerUrl;

  getLeads(workspaceId: any) {
    return this.http.post(`${this.appServerUrl}/features/leads`, {workspaceId});
  }

  createLead(lead: any) {
    return this.http.post(`${this.appServerUrl}/features/leads/create`, {lead});
  }

  deleteLead(leadId: any) {
    return this.http.delete(`${this.appServerUrl}/features/leads/${leadId}`);
  }

  constructor(private http: HttpClient) { }
}
