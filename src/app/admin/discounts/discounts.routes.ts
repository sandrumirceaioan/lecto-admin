import { Routes } from "@angular/router";
import { RoleGuard } from "src/app/shared/guards/role.guard";
import { DiscountResolve } from "./discount.resolve";

export const DiscountsRoutes: Routes = [
    {
        path: '',
        data: { title: 'Discounts' },
        loadComponent: () => import('./discounts.component').then((x) => x.DiscountsComponent),
        title: 'Lectoform - Discounts'
    },
    {
        path: 'create',
        data: { title: 'Create Discount', roles: ['admin'] },
        canActivate: [RoleGuard],
        loadComponent: () => import('./discounts-create/discounts-create.component').then((x) => x.DiscountsCreateComponent),
        title: 'Lectoform - Create Discount'
    },
    {
        path: ':id',
        data: { title: 'Update Discount', roles: ['admin'] },
        canActivate: [RoleGuard],
        loadComponent: () => import('./discounts-create/discounts-create.component').then((x) => x.DiscountsCreateComponent),
        resolve: {
            data: DiscountResolve
        },
        title: 'Lectoform - Update Discount'
    },
];