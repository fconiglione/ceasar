import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OpportunityService {

  appServerUrl = environment.appServerUrl;

  getOpportunities(workspaceId: any) {
    return this.http.post(`${this.appServerUrl}/features/opportunities`, {workspaceId});
  }

  createOpportunity(opportunity: any) {
    return this.http.post(`${this.appServerUrl}/features/opportunities/create`, {opportunity});
  }

  deleteOpportunity(opportunityId: any) {
    return this.http.delete(`${this.appServerUrl}/features/opportunities/${opportunityId}`);
  }

  updateOpportunity(opportunity: any) {
    return this.http.put(`${this.appServerUrl}/features/opportunities/update`, {opportunity});
  }

  constructor(private http: HttpClient) { }
}
