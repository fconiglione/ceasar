import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { switchMap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  appServerUrl = environment.appServerUrl;

  constructor(private http: HttpClient, private authService: AuthService, private cookieService: CookieService) { }

  getWorkspaces() {
    return this.authService.getUserDetails().pipe(
      switchMap((userDetails: any) => {
        const user_id = userDetails.user_id;
        return this.http.post(`${this.appServerUrl}/workspaces/`, { user_id });
      })
    );
  }  

  addWorkspace(workspace: any) {
    return this.authService.getUserDetails().pipe(
      switchMap((userDetails: any) => {
        const user_id = userDetails.user_id;
        return this.http.post(`${this.appServerUrl}/workspaces/create`, { workspace, user_id });
      })
    );
  }

  updateWorkspace(workspaceId : any, title: any) {
    return this.authService.getUserDetails().pipe(
      switchMap((userDetails: any) => {
        const user_id = userDetails.user_id;
        return this.http.put(`${this.appServerUrl}/workspaces/${workspaceId}`, {title, user_id});
      })
    );
  }

  deleteWorkspace(workspaceId: any) {
    return this.authService.getUserDetails().pipe(
      switchMap((userDetails: any) => {
        const user_id = userDetails.user_id;
        return this.http.delete(`${this.appServerUrl}/workspaces/${workspaceId}`, { body: { user_id } });
      })
    );
  }  

  getWorkspaceByWorkspaceId(workspaceId: any) {
    return this.authService.getUserDetails().pipe(
      switchMap((userDetails: any) => {
        const user_id = userDetails.user_id;
        return this.http.post(`${this.appServerUrl}/workspaces/id/${workspaceId}`, { user_id }, { responseType: 'text' }); // added response type to prevent JSON formatting
      })
    );
  }

  updateLastOpenedDate(workspaceId: any, last_opened_date: any) {
    return this.authService.getUserDetails().pipe(
      switchMap((userDetails: any) => {
        const user_id = userDetails.user_id;
        return this.http.put(`${this.appServerUrl}/workspaces/last-opened/${workspaceId}`, { last_opened_date, user_id });
      })
    );
  }

  getWorkspaceFeatures(workspaceId: any) {
    return this.authService.getUserDetails().pipe(
      switchMap((userDetails: any) => {
        const user_id = userDetails.user_id;
        return this.http.post(`${this.appServerUrl}/workspaces/features/${workspaceId}`, { user_id });
      })
    );
  }

  updateWorkspaceFeatures(workspaceId: any, has_leads: any, has_accounts: any, has_opportunities: any, has_contacts: any, has_files: any, has_reports: any) {
    return this.authService.getUserDetails().pipe(
      switchMap((userDetails: any) => {
        const user_id = userDetails.user_id;
        return this.http.put(`${this.appServerUrl}/workspaces/features/${workspaceId}`, { user_id, has_leads, has_accounts, has_opportunities, has_contacts, has_files, has_reports });
      })
    );
  }  

}