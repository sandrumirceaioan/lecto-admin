import {
    HttpClient,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertService } from '@full-fledged/alerts';
import { catchError, map, Observable, throwError, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminService } from '../admin.service';
import { Settings } from '../../shared/models/settings.model';


@Injectable({
    providedIn: 'root',
})
export class SettingsService {
    apiPath: string = environment.BACKEND_URL;
    settings: Settings;

    constructor(
        private http: HttpClient,
        private alertService: AlertService,
        private adminService: AdminService
    ) { }

    getSettings(): Observable<Settings> {
        return this.http.get(`${this.apiPath}/settings`).pipe(
            map((result: any) => {
                return result;
            }),
            catchError((error) => {
                this.alertService.danger(error.error.message);
                return throwError(() => error.error);
            })
        );
    }

    saveSettings(settings: Settings): Observable<Settings> {
        this.adminService.setLoading(true);
        return this.http.post(`${this.apiPath}/settings/save`, settings).pipe(
            map((result: any) => {
                this.adminService.setLoading(false);
                this.alertService.success('Setari salvate');
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
