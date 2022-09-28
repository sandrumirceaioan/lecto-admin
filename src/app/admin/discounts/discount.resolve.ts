import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { forkJoin, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DiscountsService } from './discounts.service';

@Injectable()
export class DiscountResolve implements Resolve<any> {
    constructor(
        private discountsService: DiscountsService,
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const discountId = route.params['id'];

        return forkJoin({
            discount: this.discountsService.getDiscountById(discountId),
        }).pipe(
            map((result: any) => {
                return result;
            }),
            catchError((error) => {
                console.error('DISCOUNT RESOLVE ERROR: ', error);
                return throwError(() => error.error);
            })
        );
    }
}