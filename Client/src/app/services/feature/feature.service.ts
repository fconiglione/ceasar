import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FeatureService {
  home: boolean = false;
  leads: boolean = false;
  accounts: boolean = false;
  opportunities: boolean = false;
  contacts: boolean = false;
  files: boolean = false;
  reports: boolean = false;

  constructor() { }

  setActiveFeature(feature: string) {
    // Reset all features
    this.resetFeatures();

    // Set the active feature
    switch (feature) {
      case 'home':
        this.home = true;
        break;
      case 'leads':
        this.leads = true;
        break;
      case 'accounts':
        this.accounts = true;
        break;
      case 'opportunities':
        this.opportunities = true;
        break;
      case 'contacts':
        this.contacts = true;
        break;
      case 'files':
        this.files = true;
        break;
      case 'reports':
        this.reports = true;
        break;
      default:
        this.home = true;
        break;
    }
  }

  resetFeatures() {
    this.home = false;
    this.leads = false;
    this.accounts = false;
    this.opportunities = false;
    this.contacts = false;
    this.files = false;
    this.reports = false;
  }
}