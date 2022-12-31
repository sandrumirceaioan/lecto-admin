import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from "../services/auth.service";
import { catchError, map, take, tap } from "rxjs/operators";
import { User } from '../models/user.model';
import { AlertService } from '@full-fledged/alerts';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private alertService: AlertService,
    ) { }
    canActivate(next): Observable<boolean> {
        return this.authService.verify().pipe(
            map(user => {
                if (next.data.roles.includes(user.role)) {
                    return true;
                } else {
                    this.alertService.danger('Access denied');
                    this.authService.logout();
                    return false;
                }
            })
        )
        
        

    }

}
