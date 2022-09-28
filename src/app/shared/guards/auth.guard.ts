import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, Observable, of, take } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.authService.verify().pipe(
            take(1),
            map(() => {
                return true;
            }),
            catchError((error) => {
                console.log('GUARD: ', error);
                return of(null);
            })
        );
    }

}
