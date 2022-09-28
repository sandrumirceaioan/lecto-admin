import { Routes } from "@angular/router";
import { AuthGuard } from "./shared/guards/auth.guard";
import { RoleGuard } from "./shared/guards/role.guard";

export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth'
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((x) => x.AuthRoutes),
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.AdminRoutes),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'user'] },
  },
  {
    path: '**',
    redirectTo: 'welcome'
  }
];