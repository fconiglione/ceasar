import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  appServerUrl = environment.appServerUrl;

  constructor(private http: HttpClient) { }

  getFiles(workspaceId: any) {
    return this.http.post(`${this.appServerUrl}/features/files`, {workspaceId});
  }

  uploadFile(file: any, workspaceId: any) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('workspaceId', workspaceId);
    return this.http.post(`${this.appServerUrl}/features/files/upload`, formData);
  }

  deleteFile(public_id: any, resourceType: any) {
    return this.http.delete(`${this.appServerUrl}/features/files/${public_id}?resourceType=${resourceType}`);
  }
}
