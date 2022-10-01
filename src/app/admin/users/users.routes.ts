import { Routes } from "@angular/router";
import { RoleGuard } from "src/app/shared/guards/role.guard";
import { UserResolve } from "./user.resolve";

export const UsersRoutes: Routes = [
    {
        path: '',
        data: { title: 'Utilizatori' },
        loadComponent: () => import('./users.component').then((x) => x.UsersComponent),
        title: 'Lectoform - Utilizatori'
    },
    {
        path: ':id',
        data: { title: 'Editeaza utilizator', roles: ['admin'] },
        canActivate: [RoleGuard],
        loadComponent: () => import('./users-edit/users-edit.component').then((x) => x.UsersEditComponent),
        resolve: {
            data: UserResolve
        },
        title: 'Lectoform - Editeaza utilizator'
    },
];