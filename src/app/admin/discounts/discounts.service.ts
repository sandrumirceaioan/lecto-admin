import {
    HttpClient,
    HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertService } from '@full-fledged/alerts';
import { catchError, map, Observable, throwError, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminService } from '../admin.service';
import { Discount } from '../../shared/models/discount.model';

@Injectable({
    providedIn: 'root',
})
export class DiscountsService {
    apiPath: string = environment.BACKEND_URL;
    discounts: Discount[];
    discountsSubject: Subject<{ discounts: Discount[], total: number }> = new Subject();


    constructor(
        private http: HttpClient,
        private alertService: AlertService,
        private adminService: AdminService
    ) { }

    getDiscounts(payload?: any): Observable<Discount[]> {
        this.adminService.setLoading(true);
        let params = new HttpParams();

        if (payload.pageIndex) params = params.append('skip', payload.pageIndex.toString());
        if (payload.pageSize) params = params.append('limit', payload.pageSize.toString());
        if (payload.sortField) params = params.append('sort', payload.sortField);
        if (payload.sortDirection) params = params.append('direction', payload.sortDirection);
        if (payload.filter) params = params.append('search', payload.filter.toString());


        return this.http.get(`${this.apiPath}/discounts/paginated`, { params }).pipe(
            map((result: any) => {
                this.adminService.setLoading(false);
                this.discountsSubject.next(result);
                return result.discounts;
            }),
            catchError((error) => {
                this.adminService.setLoading(false);
                this.alertService.danger(error.error.message);
                return throwError(() => error.error);
            })
        );
    }

    getAllDiscounts(): Observable<Discount[]> {
        return this.http.get(`${this.apiPath}/discounts`).pipe(
            map((result: any) => {
                this.discounts = result;
                return result;
            }),
            catchError((error) => {
                this.alertService.danger(error.error.message);
                return throwError(() => error.error);
            })
        );
    }

    createDiscount(data): Observable<Discount> {
        this.adminService.setLoading(true);
        return this.http.post(`${this.apiPath}/discounts/create`, data).pipe(
            map((result: any) => {
                this.adminService.setLoading(false);
                this.alertService.success('Created');
                return result;
            }),
            catchError((error) => {
                this.adminService.setLoading(false);
                this.alertService.danger(error.error.message);
                return throwError(() => error.error);
            })
        );
    }

    getDiscountById(id): Observable<Discount> {
        return this.http.get(`${this.apiPath}/discounts/${id}`).pipe(
            map((result: any) => {
                return result;
            }),
            catchError((error) => {
                this.alertService.danger(error.error.message);
                return throwError(() => error.error);
            })
        );
    }

    updateDiscountById(id, data): Observable<Discount> {
        this.adminService.setLoading(true);
        return this.http.put(`${this.apiPath}/discounts/${id}`, data).pipe(
            map((result: any) => {
                this.adminService.setLoading(false);
                this.alertService.success('Updated');
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
