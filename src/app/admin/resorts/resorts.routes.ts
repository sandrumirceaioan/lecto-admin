import { Routes } from "@angular/router";
import { RoleGuard } from "src/app/shared/guards/role.guard";
import { ResortResolve } from "./resort.resolve";

export const ResortsRoutes: Routes = [
    {
        path: '',
        data: { title: 'Statiuni' },
        loadComponent: () => import('./resorts.component').then((x) => x.ResortsComponent),
        title: 'Lectoform - Statiuni'
    },
    {
        path: 'adauga',
        data: { title: 'Adauga Statiune', roles: ['admin'] },
        canActivate: [RoleGuard],
        loadComponent: () => import('./resorts-create/resorts-create.component').then((x) => x.ResortsCreateComponent),
        title: 'Lectoform - Adauga Statiune',
    },
    {
        path: ':id',
        data: { title: 'Editeaza Statiune', roles: ['admin'] },
        canActivate: [RoleGuard],
        loadComponent: () => import('./resorts-create/resorts-create.component').then((x) => x.ResortsCreateComponent),
        resolve: {
            data: ResortResolve
        },
        title: 'Lectoform - Editeaza Statiune'
    },
];