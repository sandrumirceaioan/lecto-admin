import { Routes } from "@angular/router";
import { RoleGuard } from "src/app/shared/guards/role.guard";
import { SessionDataResolve } from "./session-data.resolve";
import { SessionResolve } from "./session.resolve";

export const SessionsRoutes: Routes = [
    {
        path: '',
        data: { title: 'Sesiuni' },
        loadComponent: () => import('./sessions.component').then((x) => x.SessionsComponent),
        title: 'Lectoform - Sesiuni'
    },
    {
        path: 'adauga',
        data: { title: 'Adauga Sesiune', roles: ['admin'] },
        canActivate: [RoleGuard],
        loadComponent: () => import('./sessions-create/sessions-create.component').then((x) => x.SessionsCreateComponent),
        title: 'Lectoform - Adauga Sesiune',
        resolve: {
            data: SessionDataResolve
        },
    },
    {
        path: ':id',
        data: { title: 'Editeaza Sesiune', roles: ['admin'] },
        canActivate: [RoleGuard],
        loadComponent: () => import('./sessions-create/sessions-create.component').then((x) => x.SessionsCreateComponent),
        resolve: {
            session: SessionResolve,
            data: SessionDataResolve
        },
        title: 'Lectoform - Editeaza Sesiune'
    },
];