import { Routes } from '@angular/router';
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import { SearchComponent } from './pages/search/search.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'search', component: SearchComponent }
];
