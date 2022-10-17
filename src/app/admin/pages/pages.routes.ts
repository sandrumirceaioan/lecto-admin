import { Routes } from "@angular/router";
import { RoleGuard } from "src/app/shared/guards/role.guard";
import { PageResolve } from "./page.resolve";

export const PagesRoutes: Routes = [
    {
        path: '',
        data: { title: 'Pagini' },
        loadComponent: () => import('./pages.component').then((x) => x.PagesComponent),
        title: 'Lectoform - Pagini'
    },
    {
        path: 'adauga',
        data: { title: 'Adauga Pagina', roles: ['admin'] },
        canActivate: [RoleGuard],
        loadComponent: () => import('./pages-create/pages-create.component').then((x) => x.PagesCreateComponent),
        title: 'Lectoform - Adauga Pagina',
    },
    {
        path: ':id',
        data: { title: 'Editeaza Pagina', roles: ['admin'] },
        canActivate: [RoleGuard],
        loadComponent: () => import('./pages-create/pages-create.component').then((x) => x.PagesCreateComponent),
        resolve: {
            data: PageResolve
        },
        title: 'Lectoform - Editeaza Pagina'
    },
];