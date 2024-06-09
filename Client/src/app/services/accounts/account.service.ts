import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  appServerUrl = environment.appServerUrl;

  constructor( private httpClient: HttpClient ) { }

  getAccounts(workspaceId: any) {
    return this.httpClient.post(`${this.appServerUrl}/features/accounts`, {workspaceId});
  }

  createAccount(account: any) {
    return this.httpClient.post(`${this.appServerUrl}/features/accounts/create`, {account});
  }

  deleteAccount(accountId: any) {
    return this.httpClient.delete(`${this.appServerUrl}/features/accounts/${accountId}`);
  }

  updateAccount(account: any) {
    return this.httpClient.put(`${this.appServerUrl}/features/accounts/update`, {account});
  }
}
