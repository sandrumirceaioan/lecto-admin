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
                path: 'profesori',
                loadChildren: () => import('./teachers/teachers.routes').then(m => m.TeachersRoutes),
            },
            {
                path: 'locatii',
                loadChildren: () => import('./locations/locations.routes').then(m => m.LocationsRoutes),
            },
            {
                path: 'cursuri',
                loadChildren: () => import('./courses/course.routes').then(m => m.CoursesRoutes),
            },
            {
                path: 'sesiuni',
                loadChildren: () => import('./sessions/session.routes').then(m => m.SessionsRoutes),
            },
            {
                path: 'pagini',
                loadChildren: () => import('./pages/pages.routes').then(m => m.PagesRoutes),
            },

            // {
            //     path: 'discounturi',
            //     loadChildren: () => import('./discounts/discounts.routes').then(m => m.DiscountsRoutes),
            // },
            {
                path: '**',
                redirectTo: '/admin/utilizatori'
            }
        ]
    },

];