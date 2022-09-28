import { Routes } from "@angular/router";
import { RoleGuard } from "src/app/shared/guards/role.guard";
import { UserResolve } from "./user.resolve";

export const UsersRoutes: Routes = [
    {
        path: '',
        data: { title: 'Users' },
        loadComponent: () => import('./users.component').then((x) => x.UsersComponent),
        title: 'Lectoform - Users'
    },
    {
        path: ':id',
        data: { title: 'Edit User', roles: ['admin'] },
        canActivate: [RoleGuard],
        loadComponent: () => import('./users-edit/users-edit.component').then((x) => x.UsersEditComponent),
        resolve: {
            data: UserResolve
        },
        title: 'Lectoform - Edit User'
    },
];