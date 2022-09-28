import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from "../services/auth.service";
import { catchError, map, take } from "rxjs/operators";
import { User } from '../models/user.model';
import { AlertService } from '@full-fledged/alerts';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private alertService: AlertService
    ) { }
    canActivate(next): Observable<boolean> {

        if (this.authService.currentUser) {
            if (next.data.roles.includes(this.authService.currentUser.role)) {
                return of(true);
            } else {
                this.alertService.danger('Accesul interzis');
                return of(false);
            }
        }

        return this.authService.user$.pipe(
            map((user: User) => {
                if (next.data.roles.includes(user.role)) {
                    return true;
                } else {
                    this.alertService.danger('Accesul interzis');
                    return false;
                }
            })
        );
    }

}
