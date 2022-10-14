import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { forkJoin, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SessionsService } from './sessions.service';

@Injectable()
export class SessionResolve implements Resolve<any> {
    constructor(
        private sessionsService: SessionsService,
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const sessionId = route.params['id'];

        return forkJoin({
            session: this.sessionsService.getSessionById(sessionId),
        }).pipe(
            map((result: any) => {
                return result;
            }),
            catchError((error) => {
                console.error('SESSIONS RESOLVE ERROR: ', error);
                return throwError(() => error.error);
            })
        );
    }
}