import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { forkJoin, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SettingsService } from './settings.service';

@Injectable()
export class SettingsResolve implements Resolve<any> {
    constructor(
        private settingsService: SettingsService,
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return forkJoin({
            settings: this.settingsService.getSettings(),
        }).pipe(
            map((result: any) => {
                return result;
            }),
            catchError((error) => {
                console.error('SETTINGS RESOLVE ERROR: ', error);
                return throwError(() => error.error);
            })
        );
    }
}