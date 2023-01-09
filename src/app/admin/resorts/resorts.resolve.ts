import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, forkJoin, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ResortsService } from '../resorts/resorts.service';

@Injectable()
export class ResortsResolve implements Resolve<any> {
    data: BehaviorSubject<any> = new BehaviorSubject(null);

    constructor(
        private resortsService: ResortsService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return forkJoin({
            resorts: this.resortsService.getAllResorts()
        }).pipe(
            map((result: any) => {
                return result;
            }),
            catchError((error) => {
                console.error('RESORTS RESOLVE ERROR: ', error);
                return throwError(() => error.error);
            })
        );
    }
}