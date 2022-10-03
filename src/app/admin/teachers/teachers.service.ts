import {
    HttpClient,
    HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertService } from '@full-fledged/alerts';
import { catchError, map, Observable, throwError, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminService } from '../admin.service';
import { Teacher } from '../../shared/models/teacher.model';

@Injectable({
    providedIn: 'root',
})
export class TeachersService {
    apiPath: string = environment.BACKEND_URL;
    teachers: Teacher[];
    teachersSubject: Subject<{ teachers: Teacher[], total: number }> = new Subject();


    constructor(
        private http: HttpClient,
        private alertService: AlertService,
        private adminService: AdminService
    ) { }

    getTeachers(payload?: any): Observable<Teacher[]> {
        this.adminService.setLoading(true);
        let params = new HttpParams();

        if (payload.pageIndex) params = params.append('skip', payload.pageIndex.toString());
        if (payload.pageSize) params = params.append('limit', payload.pageSize.toString());
        if (payload.sortField) params = params.append('sort', payload.sortField);
        if (payload.sortDirection) params = params.append('direction', payload.sortDirection);
        if (payload.filter) params = params.append('search', payload.filter.toString());


        return this.http.get(`${this.apiPath}/teachers/paginated`, { params }).pipe(
            map((result: any) => {
                this.adminService.setLoading(false);
                this.teachersSubject.next(result);
                return result.teachers;
            }),
            catchError((error) => {
                this.adminService.setLoading(false);
                this.alertService.danger(error.error.message);
                return throwError(() => error.error);
            })
        );
    }

    getAllTeachers(): Observable<Teacher[]> {
        return this.http.get(`${this.apiPath}/teachers`).pipe(
            map((result: any) => {
                this.teachers = result;
                return result;
            }),
            catchError((error) => {
                this.alertService.danger(error.error.message);
                return throwError(() => error.error);
            })
        );
    }

    getTeacherById(id): Observable<Teacher> {
        return this.http.get(`${this.apiPath}/teachers/${id}`).pipe(
            map((result: any) => {
                return result;
            }),
            catchError((error) => {
                this.alertService.danger(error.error.message);
                return throwError(() => error.error);
            })
        );
    }

    createTeacher(teacher: Teacher): Observable<Teacher> {
        this.adminService.setLoading(true);
        let formData = new FormData();

        if (teacher.nume) formData.append("nume", teacher.nume);
        if (teacher.experienta) formData.append("experienta", teacher.experienta);
        if (teacher.descriere) formData.append("descriere", teacher.descriere);
        if (teacher.email) formData.append("email", teacher.email);
        if (teacher.telefon) formData.append("telefon", teacher.telefon);

        if (teacher.imagine && teacher.imagine.file) {
            formData.append("imagine", JSON.stringify(teacher.imagine));
            formData.append("file", teacher.imagine.file);
        }

        return this.http.post(`${this.apiPath}/teachers/create`, formData).pipe(
            map((result: any) => {
                this.adminService.setLoading(false);
                this.alertService.success('Profesor salvat');
                return result;
            }),
            catchError((error) => {
                this.adminService.setLoading(false);
                this.alertService.danger(error.error.message);
                return throwError(() => error.error);
            })
        );
    }

    updateTeacherById(id, teacher): Observable<Teacher> {
        this.adminService.setLoading(true);
        let formData = new FormData();

        if (teacher.nume) formData.append("nume", teacher.nume);
        if (teacher.experienta) formData.append("experienta", teacher.experienta);
        if (teacher.descriere) formData.append("descriere", teacher.descriere);
        if (teacher.email) formData.append("email", teacher.email);
        if (teacher.telefon) formData.append("telefon", teacher.telefon);

        if (teacher.imagine) {
            formData.append("imagine", JSON.stringify(teacher.imagine));

            if (teacher.imagine.file && !teacher.imagine.small && !teacher.imagine.original) {
                formData.append("file", teacher.imagine.file);
            }
        }

        this.adminService.setLoading(true);
        return this.http.put(`${this.apiPath}/teachers/${id}`, formData).pipe(
            map((result: any) => {
                this.adminService.setLoading(false);
                this.alertService.success('Profesor salvat');
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
