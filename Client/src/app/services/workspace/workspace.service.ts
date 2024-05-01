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
    console.log(workspaceId, title);
    return this.http.put(`${this.appServerUrl}/workspaces/${workspaceId}`, {title});
  }

  deleteWorkspace(workspaceId: string) {
    return this.http.delete(`${this.appServerUrl}/workspaces/${workspaceId}`);
  }

}