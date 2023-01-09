import {
    HttpClient,
    HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertService } from '@full-fledged/alerts';
import { catchError, map, Observable, throwError, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminService } from '../admin.service';
import { Location } from '../../shared/models/location.model';
import { Resort } from 'src/app/shared/models/resort.model';

@Injectable({
    providedIn: 'root',
})
export class ResortsService {
    apiPath: string = environment.BACKEND_URL;
    appPath: string = environment.BACKEND_APP;
    resorts: Location[];
    resortsSubject: Subject<{ resorts: Resort[], total: number }> = new Subject();


    constructor(
        private http: HttpClient,
        private alertService: AlertService,
        private adminService: AdminService
    ) { }

    getResorts(payload?: any): Observable<Resort[]> {
        this.adminService.setLoading(true);
        let params = new HttpParams();

        if (payload.pageIndex) params = params.append('skip', payload.pageIndex.toString());
        if (payload.pageSize) params = params.append('limit', payload.pageSize.toString());
        if (payload.sortField) params = params.append('sort', payload.sortField);
        if (payload.sortDirection) params = params.append('direction', payload.sortDirection);
        if (payload.filter) params = params.append('search', payload.filter.toString());


        return this.http.get(`${this.apiPath}/resorts/paginated`, { params }).pipe(
            map((result: any) => {
                this.adminService.setLoading(false);
                this.resortsSubject.next(result);
                return result.resorts;
            }),
            catchError((error) => {
                this.adminService.setLoading(false);
                this.alertService.danger(error.error.message);
                return throwError(() => error.error);
            })
        );
    }


    getAllResorts(): Observable<Resort[]> {
        return this.http.get(`${this.apiPath}/resorts`).pipe(
            map((result: any) => {
                this.resorts = result;
                return result;
            }),
            catchError((error) => {
                this.alertService.danger(error.error.message);
                return throwError(() => error.error);
            })
        );
    }


    createResort(resort): Observable<Resort> {
        this.adminService.setLoading(true);
        let formData = new FormData();

        if (resort.resort) formData.append("resort", resort.resort);
        if (resort.url) formData.append("url", resort.url);
        if (resort.descriere) formData.append("descriere", resort.descriere);
        if (resort.oras) formData.append("oras", resort.oras);
        if (resort.judet) formData.append("judet", resort.judet);
        formData.append("status", JSON.stringify(resort.status));

        if (resort.imagine && resort.imagine.file) formData.append("file", resort.imagine.file);

        return this.http.post(`${this.apiPath}/resorts/create`, formData).pipe(
            map((result: any) => {
                this.adminService.setLoading(false);
                this.alertService.success('Statiune salvata');
                return result;
            }),
            catchError((error) => {
                this.adminService.setLoading(false);
                this.alertService.danger(error.error.message);
                return throwError(() => error.error);
            })
        );
    }


    getResortById(id): Observable<Resort> {
        return this.http.get(`${this.apiPath}/resorts/one/${id}`).pipe(
            map((result: any) => {
                return result;
            }),
            catchError((error) => {
                this.alertService.danger(error.error.message);
                return throwError(() => error.error);
            })
        );
    }

    getRomanianLocations(filter): Observable<any> {
        let params = new HttpParams();
        if (filter) params = params.append('search', filter.toString());

        return this.http.get(`${this.apiPath}/resorts/filter`, { params }).pipe(
            map((result: any) => {
                return result;
            }),
            catchError((error) => {
                this.alertService.danger(error.error.message);
                return throwError(() => error.error);
            })
        );
    }

    // search resorts - used in locations
    searchResorts(filter): Observable<Resort[]> {
        let params = new HttpParams();
        if (filter) params = params.append('search', filter.toString());
        return this.http.get(`${this.apiPath}/resorts/search`, { params }).pipe(
            map((result: any) => {
                return result;
            }),
            catchError((error) => {
                this.alertService.danger(error.error.message);
                return throwError(() => error.error);
            })
        );
    }

    updateResortById(id, resort): Observable<Location> {
        this.adminService.setLoading(true);
        let formData = new FormData();

        if (resort.resort) formData.append("resort", resort.resort);
        if (resort.url) formData.append("url", resort.url);
        if (resort.descriere) formData.append("descriere", resort.descriere);
        if (resort.oras) formData.append("oras", resort.oras);
        if (resort.judet) formData.append("judet", resort.judet);
        formData.append("status", JSON.stringify(resort.status));

        if (resort.imagine) {
            formData.append("imagine", JSON.stringify(resort.imagine));

            if (resort.imagine.file && !resort.imagine.small && !resort.imagine.original) {
                formData.append("file", resort.imagine.file);
            }
        }

        return this.http.post(`${this.apiPath}/resorts/update/${id}`, formData).pipe(
            map((result: any) => {
                this.adminService.setLoading(false);
                this.alertService.success('Statiune salvata');
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
