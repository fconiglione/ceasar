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

  getFolders(workspaceId: any) {
    return this.http.post(`${this.appServerUrl}/features/files/folders`, {workspaceId});
  }

  uploadFile(file: any, info: any) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('info', JSON.stringify(info));
    return this.http.post(`${this.appServerUrl}/features/files/upload`, formData);
  }

  updateFile(file: any) {
    return this.http.put(`${this.appServerUrl}/features/files`, {file});
  }

  updateFolder(folder: any) {
    return this.http.put(`${this.appServerUrl}/features/files/folders`, {folder});
  }

  deleteFile(public_id: any, resourceType: any) {
    return this.http.delete(`${this.appServerUrl}/features/files/${public_id}?resourceType=${resourceType}`);
  }

  createFolder(folder: any) {
    return this.http.post(`${this.appServerUrl}/features/files/folders/create`, {folder});
  }

  deleteFolder(folder_id: any) {
    return this.http.delete(`${this.appServerUrl}/features/files/folders/${folder_id}`);
  }
}
