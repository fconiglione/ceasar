import { Routes } from '@angular/router';
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { SearchComponent } from './pages/search/search.component';
import { WorkspaceComponent } from './pages/workspace/workspace.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from '@auth0/auth0-angular';

export const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
  { path: 'ws', component: WorkspaceComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];