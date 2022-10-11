import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { forkJoin, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DiscountsService } from '../discounts/discounts.service';
import { TeachersService } from '../teachers/teachers.service';

@Injectable()
export class SessionDataResolve implements Resolve<any> {
    constructor(
        private teachersService: TeachersService,
        private discountsService: DiscountsService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return forkJoin({
            teachers: this.teachersService.getAllTeachers(),
            discounts: this.discountsService.getAllDiscounts()
        }).pipe(
            map((result: any) => {
                return result;
            }),
            catchError((error) => {
                console.error('SESSION DATA RESOLVE ERROR: ', error);
                return throwError(() => error.error);
            })
        );
    }
}