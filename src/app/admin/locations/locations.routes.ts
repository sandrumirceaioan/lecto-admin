import { Routes } from "@angular/router";
import { RoleGuard } from "src/app/shared/guards/role.guard";
import { LocationResolve } from "./location.resolve";

export const LocationsRoutes: Routes = [
    {
        path: '',
        data: { title: 'Locatii' },
        loadComponent: () => import('./locations.component').then((x) => x.LocationsComponent),
        title: 'Lectoform - Locatii'
    },
    {
        path: 'adauga',
        data: { title: 'Adauga Locatie', roles: ['admin'] },
        canActivate: [RoleGuard],
        loadComponent: () => import('./locations-create/locations-create.component').then((x) => x.LocationsCreateComponent),
        title: 'Lectoform - Adauga Locatie',
    },
    {
        path: ':id',
        data: { title: 'Editeaza Locatie', roles: ['admin'] },
        canActivate: [RoleGuard],
        loadComponent: () => import('./locations-create/locations-create.component').then((x) => x.LocationsCreateComponent),
        resolve: {
            data: LocationResolve
        },
        title: 'Lectoform - Editeaza Locatie'
    },
];