import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  appServerUrl = environment.appServerUrl;

  constructor(private http: HttpClient) { }

  getWorkspaces(sub: any) {
    return this.http.post(`${this.appServerUrl}/workspaces/`, { sub });
  }

  addWorkspace(sub: any, workspace: any) {
    return this.http.post(`${this.appServerUrl}/workspaces/create`, { workspace, sub });
  }

  updateWorkspace(sub: any, workspaceId: any, title: any) {
    return this.http.put(`${this.appServerUrl}/workspaces/${workspaceId}`, { title, sub });
  }

  deleteWorkspace(sub: any, workspaceId: string) {
    return this.http.delete(`${this.appServerUrl}/workspaces/${workspaceId}`, { body: { sub } });
  }

  getWorkspaceByWorkspaceId(sub: any, workspaceId: string) {
    return this.http.post(`${this.appServerUrl}/workspaces/id/${workspaceId}`, { sub }, { responseType: 'text' });
  }  

  updateLastOpenedDate(sub: any, workspaceId: any, last_opened_date: string) {
    return this.http.put(`${this.appServerUrl}/workspaces/last-opened/${workspaceId}`, { last_opened_date, sub });
  }

  getWorkspaceFeatures(sub: any, workspaceId: string) {
    return this.http.post(`${this.appServerUrl}/workspaces/features/${workspaceId}`, { sub });
  }

  updateWorkspaceFeatures(
    sub: any,
    workspaceId: any,
    has_leads: boolean,
    has_accounts: boolean,
    has_opportunities: boolean,
    has_contacts: boolean,
    has_files: boolean,
    has_reports: boolean
  ) {
    return this.http.put(`${this.appServerUrl}/workspaces/features/${workspaceId}`, {
      sub, has_leads, has_accounts, has_opportunities, has_contacts, has_files, has_reports
    });
  }
}
