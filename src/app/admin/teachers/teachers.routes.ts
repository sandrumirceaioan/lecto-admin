import { Routes } from "@angular/router";
import { RoleGuard } from "src/app/shared/guards/role.guard";
import { TeacherResolve } from "./teacher.resolve";

export const TeachersRoutes: Routes = [
    {
        path: '',
        data: { title: 'Profesori' },
        loadComponent: () => import('./teachers.component').then((x) => x.TeachersComponent),
        title: 'Lectoform - Profesori'
    },
    {
        path: 'adauga',
        data: { title: 'Adauga Profesor', roles: ['admin'] },
        canActivate: [RoleGuard],
        loadComponent: () => import('./teachers-create/teachers-create.component').then((x) => x.TeachersCreateComponent),
        title: 'Lectoform - Adauga Profesor',
    },
    {
        path: ':id',
        data: { title: 'Editeaza Profesor', roles: ['admin'] },
        canActivate: [RoleGuard],
        loadComponent: () => import('./teachers-create/teachers-create.component').then((x) => x.TeachersCreateComponent),
        resolve: {
            data: TeacherResolve
        },
        title: 'Lectoform - Editeaza Profesor'
    },
];