import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { forkJoin, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ResortsService } from './resorts.service';

@Injectable()
export class ResortResolve implements Resolve<any> {
    constructor(
        private resortsService: ResortsService,
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const resortId = route.params['id'];

        return forkJoin({
            resort: this.resortsService.getResortById(resortId),
        }).pipe(
            map((result: any) => {
                return result;
            }),
            catchError((error) => {
                console.error('RESORT RESOLVE ERROR: ', error);
                return throwError(() => error.error);
            })
        );
    }
}