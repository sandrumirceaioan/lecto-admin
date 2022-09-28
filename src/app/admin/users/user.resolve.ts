import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { forkJoin, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UsersService } from './users.service';

@Injectable()
export class UserResolve implements Resolve<any> {
    constructor(
        private usersService: UsersService,
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const userId = route.params['id'];

        return forkJoin({
            user: this.usersService.getUserById(userId),
        }).pipe(
            map((result: any) => {
                return result;
            }),
            catchError((error) => {
                console.error('USER RESOLVE ERROR: ', error);
                return throwError(() => error.error);
            })
        );
    }
}