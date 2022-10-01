import { Routes } from "@angular/router";

export const AdminRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./admin.component').then((x) => x.AdminComponent),
        children: [
            {
                path: '',
                redirectTo: 'users',
                pathMatch: 'full',
            },
            {
                path: 'users',
                loadChildren: () => import('./users/users.routes').then(m => m.UsersRoutes),
            },
            {
                path: 'discounts',
                loadChildren: () => import('./discounts/discounts.routes').then(m => m.DiscountsRoutes),
            },
            {
                path: 'locations',
                loadChildren: () => import('./locations/locations.routes').then(m => m.LocationsRoutes),
            },
            {
                path: '**',
                redirectTo: '/admin/users'
            }
        ]
    },

];