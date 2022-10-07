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

@Injectable({
    providedIn: 'root',
})
export class LocationsService {
    apiPath: string = environment.BACKEND_URL;
    appPath: string = environment.BACKEND_APP;
    locations: Location[];
    locationsSubject: Subject<{ locations: Location[], total: number }> = new Subject();


    constructor(
        private http: HttpClient,
        private alertService: AlertService,
        private adminService: AdminService
    ) { }

    getLocations(payload?: any): Observable<Location[]> {
        this.adminService.setLoading(true);
        let params = new HttpParams();

        if (payload.pageIndex) params = params.append('skip', payload.pageIndex.toString());
        if (payload.pageSize) params = params.append('limit', payload.pageSize.toString());
        if (payload.sortField) params = params.append('sort', payload.sortField);
        if (payload.sortDirection) params = params.append('direction', payload.sortDirection);
        if (payload.filter) params = params.append('search', payload.filter.toString());


        return this.http.get(`${this.apiPath}/locations/paginated`, { params }).pipe(
            map((result: any) => {
                this.adminService.setLoading(false);
                this.locationsSubject.next(result);
                return result.locations;
            }),
            catchError((error) => {
                this.adminService.setLoading(false);
                this.alertService.danger(error.error.message);
                return throwError(() => error.error);
            })
        );
    }

    getAllLocations(): Observable<Location[]> {
        return this.http.get(`${this.apiPath}/locations`).pipe(
            map((result: any) => {
                this.locations = result;
                return result;
            }),
            catchError((error) => {
                this.alertService.danger(error.error.message);
                return throwError(() => error.error);
            })
        );
    }

    createLocation(location): Observable<Location> {
        this.adminService.setLoading(true);
        let formData = new FormData();

        if (location.locatie) formData.append("locatie", location.locatie);
        if (location.url) formData.append("url", location.url);
        if (location.descriere) formData.append("descriere", location.descriere);
        if (location.oras) formData.append("oras", location.oras);
        if (location.judet) formData.append("judet", location.judet);
        formData.append("status", JSON.stringify(location.status));

        if (location.galerie && location.galerie.length) {
            formData.append("galerie", JSON.stringify(location.galerie));

            location.galerie.forEach(item => {
                formData.append("images[]", item.file);
            });
        }

        return this.http.post(`${this.apiPath}/locations/create`, formData).pipe(
            map((result: any) => {
                this.adminService.setLoading(false);
                this.alertService.success('Locatie salvata');
                return result;
            }),
            catchError((error) => {
                this.adminService.setLoading(false);
                this.alertService.danger(error.error.message);
                return throwError(() => error.error);
            })
        );
    }

    getLocationById(id): Observable<Location> {
        return this.http.get(`${this.apiPath}/locations/one/${id}`).pipe(
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

        return this.http.get(`${this.apiPath}/locations/filter`, { params }).pipe(
            map((result: any) => {
                return result;
            }),
            catchError((error) => {
                this.alertService.danger(error.error.message);
                return throwError(() => error.error);
            })
        );
    }

    updateLocationById(id, location): Observable<Location> {
            this.adminService.setLoading(true);
            let formData = new FormData();

            console.log(location);
    
            if (location.locatie) formData.append("locatie", location.locatie);
            if (location.url) formData.append("url", location.url);
            if (location.descriere) formData.append("descriere", location.descriere);
            if (location.oras) formData.append("oras", location.oras);
            if (location.judet) formData.append("judet", location.judet);
            formData.append("status", JSON.stringify(location.status));
    
            if (location.galerie && location.galerie.length) {
                formData.append("galerie", JSON.stringify(location.galerie));
    
                
                location.galerie.forEach(item => {
                    if (item.file && !item.small && !item.original) formData.append("images[]", item.file);
                });
            }
    
            return this.http.post(`${this.apiPath}/locations/update/${id}`, formData).pipe(
                map((result: any) => {
                    this.adminService.setLoading(false);
                    this.alertService.success('Locatie salvata');
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
