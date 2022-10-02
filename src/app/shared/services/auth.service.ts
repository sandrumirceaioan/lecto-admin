import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError, Observable, of, firstValueFrom, EmptyError, lastValueFrom, Subject } from 'rxjs';
import { map, catchError, tap, first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Credentials, LoginResponse, RegisterParams, User } from '../models/user.model';
import { Router } from '@angular/router';
import { AlertService } from '@full-fledged/alerts';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    apiPath: string = environment.BACKEND_URL;
    user$ = new Subject();
    currentUser: User;

    private readonly maxy_at = "maxy_at";
    private readonly maxy_rt = "maxy_rt";

    constructor(
        private http: HttpClient,
        private router: Router,
        private alertService: AlertService
    ) { }

    register(user: RegisterParams): Observable<any> {
        return this.http.post(this.apiPath + '/auth/local/register', user, httpOptions).pipe(
            map(result => {
                this.alertService.success('Succesfully registered');
                return result;
            }),
            catchError(error => {
                this.alertService.danger(error.error.message);
                return throwError(() => error.error);
            })
        )
    }

    login(params: Credentials): Observable<any> {
        return this.http.post(`${this.apiPath}/auth/local/login`, params, httpOptions).pipe(
            tap((response: any) => this.doLoginUser(response.user, response.tokens)),
            map((result: LoginResponse) => {
                this.alertService.success(`Welcome ${result.user.email}`);
                this.user$.next(result.user);
                this.currentUser = result.user;
                return result.user;
            }),
            catchError((error) => {
                this.alertService.danger(error.error.message);
                return throwError(() => error.error);
            })
        );
    }

    verify(): Observable<any> {
        return this.http.post(`${this.apiPath}/auth/local/verify`, {}, httpOptions).pipe(
            tap((result: User) => {
                this.user$.next(result);
                this.currentUser = result;
                return result;
            }),
            catchError(error => {
                this.alertService.danger(error.error.message);
                return throwError(() => error.error);
            })
        );
    }

    logout() {
        this.http.post(`${this.apiPath}/auth/local/logout`, {}, httpOptions).pipe(
            map(() => {
                this.user$.next(null);
                this.removeTokens();
                this.router.navigate(['/auth/login']);
                console.log('LOGGED OUT');
                return;
            }),
            catchError(error => {
                this.router.navigate(['/auth/login']);
                return throwError(() => error.error);
            })
        ).subscribe();
    }


    refresh() {
        return this.http.post<any>(`${this.apiPath}/auth/local/refresh`, { refreshToken: this.getRefreshToken() }).pipe(
            tap((result) => {
                this.storeTokens(result.tokens);
            }),
            catchError((error) => {
                console.log('Intra aici');
                console.log(error.error.message);
                this.logout();
                return of(null);
            })
        );
    }


    // helpers

    getAccessToken() {
        return localStorage.getItem(this.maxy_at);
    }

    private getRefreshToken() {
        return localStorage.getItem(this.maxy_rt);
    }

    private doLoginUser(user?, tokens?) {
        this.user$.next(user);
        this.storeTokens(tokens);
    }

    private storeTokens(tokens) {
        localStorage.setItem(this.maxy_at, tokens.access_token);
        localStorage.setItem(this.maxy_rt, tokens.refresh_token);
    }

    private removeTokens() {
        localStorage.removeItem(this.maxy_at);
        localStorage.removeItem(this.maxy_rt);
    }
}