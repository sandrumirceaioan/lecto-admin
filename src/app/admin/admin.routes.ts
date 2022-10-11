import { Routes } from "@angular/router";

export const AdminRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./admin.component').then((x) => x.AdminComponent),
        children: [
            {
                path: '',
                redirectTo: 'utilizatori',
                pathMatch: 'full',
            },
            {
                path: 'utilizatori',
                loadChildren: () => import('./users/users.routes').then(m => m.UsersRoutes),
            },
            {
                path: 'cursuri',
                loadChildren: () => import('./courses/course.routes').then(m => m.CoursesRoutes),
            },
            {
                path: 'locatii',
                loadChildren: () => import('./locations/locations.routes').then(m => m.LocationsRoutes),
            },
            {
                path: 'sesiuni',
                loadChildren: () => import('./sessions/session.routes').then(m => m.SessionsRoutes),
            },
            {
                path: 'profesori',
                loadChildren: () => import('./teachers/teachers.routes').then(m => m.TeachersRoutes),
            },
            {
                path: 'discounturi',
                loadChildren: () => import('./discounts/discounts.routes').then(m => m.DiscountsRoutes),
            },
            {
                path: '**',
                redirectTo: '/admin/utilizatori'
            }
        ]
    },

];