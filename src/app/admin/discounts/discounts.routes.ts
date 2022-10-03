import { Routes } from "@angular/router";
import { RoleGuard } from "src/app/shared/guards/role.guard";
import { DiscountResolve } from "./discount.resolve";

export const DiscountsRoutes: Routes = [
    {
        path: '',
        data: { title: 'Discounturi' },
        loadComponent: () => import('./discounts.component').then((x) => x.DiscountsComponent),
        title: 'Lectoform - Discounts'
    },
    {
        path: 'adauga',
        data: { title: 'Adauga Discount', roles: ['admin'] },
        canActivate: [RoleGuard],
        loadComponent: () => import('./discounts-create/discounts-create.component').then((x) => x.DiscountsCreateComponent),
        title: 'Lectoform - Adauga Discount',
    },
    {
        path: ':id',
        data: { title: 'Editeaza Discount', roles: ['admin'] },
        canActivate: [RoleGuard],
        loadComponent: () => import('./discounts-create/discounts-create.component').then((x) => x.DiscountsCreateComponent),
        resolve: {
            data: DiscountResolve
        },
        title: 'Lectoform - Editeaza Discount'
    },
];