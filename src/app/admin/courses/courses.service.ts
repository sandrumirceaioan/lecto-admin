import {
    HttpClient,
    HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertService } from '@full-fledged/alerts';
import { catchError, map, Observable, throwError, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminService } from '../admin.service';
import { Course } from '../../shared/models/course.model';

@Injectable({
    providedIn: 'root',
})
export class CoursesService {
    apiPath: string = environment.BACKEND_URL;
    courses: Course[];
    coursesSubject: Subject<{ courses: Course[], total: number }> = new Subject();


    constructor(
        private http: HttpClient,
        private alertService: AlertService,
        private adminService: AdminService
    ) { }

    getCourses(payload?: any): Observable<Course[]> {
        this.adminService.setLoading(true);
        let params = new HttpParams();

        if (payload.pageIndex) params = params.append('skip', payload.pageIndex.toString());
        if (payload.pageSize) params = params.append('limit', payload.pageSize.toString());
        if (payload.sortField) params = params.append('sort', payload.sortField);
        if (payload.sortDirection) params = params.append('direction', payload.sortDirection);
        if (payload.filter) params = params.append('search', payload.filter.toString());


        return this.http.get(`${this.apiPath}/courses/paginated`, { params }).pipe(
            map((result: any) => {
                this.adminService.setLoading(false);
                this.coursesSubject.next(result);
                return result.courses;
            }),
            catchError((error) => {
                this.adminService.setLoading(false);
                this.alertService.danger(error.error.message);
                return throwError(() => error.error);
            })
        );
    }

    getAllCourses(): Observable<Course[]> {
        return this.http.get(`${this.apiPath}/courses`).pipe(
            map((result: any) => {
                this.courses = result;
                return result;
            }),
            catchError((error) => {
                this.alertService.danger(error.error.message);
                return throwError(() => error.error);
            })
        );
    }

    getCourseById(id): Observable<Course> {
        return this.http.get(`${this.apiPath}/courses/${id}`).pipe(
            map((result: any) => {
                return result;
            }),
            catchError((error) => {
                this.alertService.danger(error.error.message);
                return throwError(() => error.error);
            })
        );
    }

    createCourse(course: Course): Observable<Course> {
        this.adminService.setLoading(true);
        let formData = new FormData();

        if (course.titlu) formData.append("titlu", course.titlu);
        if (course.url) formData.append("url", course.url);
        if (course.descriere) formData.append("descriere", course.descriere);
        if (course.certificare) formData.append("certificare", JSON.stringify(course.certificare));
        if (course.pret) formData.append("pret", JSON.stringify(course.pret));
        formData.append("status", JSON.stringify(course.status));

        if (course.imagine && course.imagine.file) formData.append("file", course.imagine.file);

        return this.http.post(`${this.apiPath}/courses/create`, formData).pipe(
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

    updateCourseById(id, course: Course): Observable<Course> {
        this.adminService.setLoading(true);
        let formData = new FormData();

        if (course.titlu) formData.append("titlu", course.titlu);
        if (course.url) formData.append("url", course.url);
        if (course.descriere) formData.append("descriere", course.descriere);
        if (course.certificare) formData.append("certificare", JSON.stringify(course.certificare));
        if (course.pret) formData.append("pret", JSON.stringify(course.pret));
        formData.append("status", JSON.stringify(course.status));

        if (course.imagine) {
            formData.append("imagine", JSON.stringify(course.imagine));

            if (course.imagine.file && !course.imagine.small && !course.imagine.original) {
                formData.append("file", course.imagine.file);
            }
        }

        this.adminService.setLoading(true);
        return this.http.put(`${this.apiPath}/courses/${id}`, formData).pipe(
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
