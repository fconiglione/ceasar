import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  appServerUrl = environment.appServerUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getWorkspaces(userId: string) {
    return this.authService.getUserDetails().pipe(
      switchMap((userDetails: any) => {
        const userId = userDetails.user_id;
        return this.http.get(`${this.appServerUrl}/workspaces/${userId}`);
      })
    );
  }

  addWorkspace(workspace: any) {
    return this.http.post(`${this.appServerUrl}/workspaces`, workspace);
  }

  updateWorkspace(workspace: any) {
    const workspaceId = workspace.id;
    return this.http.put(`${this.appServerUrl}/workspaces/${workspaceId}`, workspace);
  }

  deleteWorkspace(workspaceId: string) {
    return this.http.delete(`${this.appServerUrl}/workspaces/${workspaceId}`);
  }

}