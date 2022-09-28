import { Routes } from "@angular/router";

export const AuthRoutes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./login/login.component').then((x) => x.LoginComponent),
        title: 'Lectoform - Login'
    },
    {
        path: 'register',
        loadComponent: () => import('./register/register.component').then((x) => x.RegisterComponent),
        title: 'Lectoform - Register'
    }

];