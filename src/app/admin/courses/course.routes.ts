import { Routes } from "@angular/router";
import { RoleGuard } from "src/app/shared/guards/role.guard";
import { CourseResolve } from "./course.resolve";

export const CoursesRoutes: Routes = [
    {
        path: '',
        data: { title: 'Cursuri' },
        loadComponent: () => import('./courses.component').then((x) => x.CoursesComponent),
        title: 'Lectoform - Cursuri'
    },
    {
        path: 'adauga',
        data: { title: 'Adauga Curs', roles: ['admin'] },
        canActivate: [RoleGuard],
        loadComponent: () => import('./courses-create/courses-create.component').then((x) => x.CoursesCreateComponent),
        title: 'Lectoform - Adauga Curs',
    },
    {
        path: ':id',
        data: { title: 'Editeaza Curs', roles: ['admin'] },
        canActivate: [RoleGuard],
        loadComponent: () => import('./courses-create/courses-create.component').then((x) => x.CoursesCreateComponent),
        resolve: {
            data: CourseResolve
        },
        title: 'Lectoform - Editeaza Curs'
    },
];