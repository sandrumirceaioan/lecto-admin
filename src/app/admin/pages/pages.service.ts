import {
    HttpClient,
    HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertService } from '@full-fledged/alerts';
import { catchError, map, Observable, throwError, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminService } from '../admin.service';
import { Page } from '../../shared/models/page.model';

@Injectable({
    providedIn: 'root',
})
export class PagesService {
    apiPath: string = environment.BACKEND_URL;
    pages: Page[];
    pagesSubject: Subject<{ pages: Page[], total: number }> = new Subject();


    constructor(
        private http: HttpClient,
        private alertService: AlertService,
        private adminService: AdminService
    ) { }

    getPages(payload?: any): Observable<Page[]> {
        this.adminService.setLoading(true);
        let params = new HttpParams();

        if (payload.pageIndex) params = params.append('skip', payload.pageIndex.toString());
        if (payload.pageSize) params = params.append('limit', payload.pageSize.toString());
        if (payload.sortField) params = params.append('sort', payload.sortField);
        if (payload.sortDirection) params = params.append('direction', payload.sortDirection);
        if (payload.filter) params = params.append('search', payload.filter.toString());


        return this.http.get(`${this.apiPath}/pages/paginated`, { params }).pipe(
            map((result: any) => {
                this.adminService.setLoading(false);
                this.pagesSubject.next(result);
                return result.pages;
            }),
            catchError((error) => {
                this.adminService.setLoading(false);
                this.alertService.danger(error.error.message);
                return throwError(() => error.error);
            })
        );
    }

    getAllPages(): Observable<Page[]> {
        return this.http.get(`${this.apiPath}/pages`).pipe(
            map((result: any) => {
                this.pages = result;
                return result;
            }),
            catchError((error) => {
                this.alertService.danger(error.error.message);
                return throwError(() => error.error);
            })
        );
    }

    getPageById(id): Observable<Page> {
        return this.http.get(`${this.apiPath}/pages/${id}`).pipe(
            map((result: any) => {
                return result;
            }),
            catchError((error) => {
                this.alertService.danger(error.error.message);
                return throwError(() => error.error);
            })
        );
    }

    createPage(page: Page): Observable<Page> {
        this.adminService.setLoading(true);
        let formData = new FormData();

        if (page.titlu) formData.append("titlu", page.titlu);
        if (page.url) formData.append("url", page.url);
        if (page.descriere) formData.append("descriere", page.descriere);
        formData.append("status", JSON.stringify(page.status));

        if (page.imagine && page.imagine.file) formData.append("file", page.imagine.file);

        return this.http.post(`${this.apiPath}/pages/create`, formData).pipe(
            map((result: any) => {
                this.adminService.setLoading(false);
                this.alertService.success('Pagina salvats');
                return result;
            }),
            catchError((error) => {
                this.adminService.setLoading(false);
                this.alertService.danger(error.error.message);
                return throwError(() => error.error);
            })
        );
    }

    updatePageById(id, page: Page): Observable<Page> {
        this.adminService.setLoading(true);
        let formData = new FormData();

        if (page.titlu) formData.append("titlu", page.titlu);
        if (page.url) formData.append("url", page.url);
        if (page.descriere) formData.append("descriere", page.descriere);
        formData.append("status", JSON.stringify(page.status));

        if (page.imagine) {
            formData.append("imagine", JSON.stringify(page.imagine));

            if (page.imagine.file && !page.imagine.small && !page.imagine.original) {
                formData.append("file", page.imagine.file);
            }
        }

        this.adminService.setLoading(true);
        return this.http.put(`${this.apiPath}/pages/${id}`, formData).pipe(
            map((result: any) => {
                this.adminService.setLoading(false);
                this.alertService.success('Pagina salvat');
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
