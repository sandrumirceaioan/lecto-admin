import {
    HttpClient,
    HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertService } from '@full-fledged/alerts';
import { catchError, map, Observable, throwError, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminService } from '../admin.service';
import { Session } from '../../shared/models/session.model';

@Injectable({
    providedIn: 'root',
})
export class SessionsService {
    apiPath: string = environment.BACKEND_URL;
    sessions: Session[];
    sessionsSubject: Subject<{ sessions: Session[], total: number }> = new Subject();


    constructor(
        private http: HttpClient,
        private alertService: AlertService,
        private adminService: AdminService
    ) { }

    getSessions(payload?: any): Observable<Session[]> {
        this.adminService.setLoading(true);
        let params = new HttpParams();

        if (payload.pageIndex) params = params.append('skip', payload.pageIndex.toString());
        if (payload.pageSize) params = params.append('limit', payload.pageSize.toString());
        if (payload.sortField) params = params.append('sort', payload.sortField);
        if (payload.sortDirection) params = params.append('direction', payload.sortDirection);
        if (payload.filter) params = params.append('search', payload.filter.toString());


        return this.http.get(`${this.apiPath}/sessions/paginated`, { params }).pipe(
            map((result: any) => {
                this.adminService.setLoading(false);
                this.sessionsSubject.next(result);
                return result.sessions;
            }),
            catchError((error) => {
                this.adminService.setLoading(false);
                this.alertService.danger(error.error.message);
                return throwError(() => error.error);
            })
        );
    }

    getAllSessions(): Observable<Session[]> {
        return this.http.get(`${this.apiPath}/sessions`).pipe(
            map((result: any) => {
                this.sessions = result;
                return result;
            }),
            catchError((error) => {
                this.alertService.danger(error.error.message);
                return throwError(() => error.error);
            })
        );
    }

    getSessionById(id): Observable<Session> {
        return this.http.get(`${this.apiPath}/sessions/${id}`).pipe(
            map((result: any) => {
                return result;
            }),
            catchError((error) => {
                this.alertService.danger(error.error.message);
                return throwError(() => error.error);
            })
        );
    }

    createSession(session: Session): Observable<Session> {
        this.adminService.setLoading(true);
        return this.http.post(`${this.apiPath}/sessions/create`, session).pipe(
            map((result: any) => {
                this.adminService.setLoading(false);
                this.alertService.success('Sesiune salvats');
                return result;
            }),
            catchError((error) => {
                this.adminService.setLoading(false);
                this.alertService.danger(error.error.message);
                return throwError(() => error.error);
            })
        );
    }

    updateSessionById(id, session: Session): Observable<Session> {
        this.adminService.setLoading(true);
        return this.http.put(`${this.apiPath}/sessions/${id}`, session).pipe(
            map((result: any) => {
                this.adminService.setLoading(false);
                this.alertService.success('Sesiune salvata');
                return result;
            }),
            catchError((error) => {
                this.adminService.setLoading(false);
                this.alertService.danger(error.error.message);
                return throwError(() => error.error);
            })
        );
    }

}
