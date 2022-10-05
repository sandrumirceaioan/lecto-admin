import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { forkJoin, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CoursesService } from './courses.service';

@Injectable()
export class CoursesResolve implements Resolve<any> {
    constructor(
        private coursesService: CoursesService,
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const courseId = route.params['id'];

        return forkJoin({
            teacher: this.coursesService.getCourseById(courseId),
        }).pipe(
            map((result: any) => {
                return result;
            }),
            catchError((error) => {
                console.error('COURSES RESOLVE ERROR: ', error);
                return throwError(() => error.error);
            })
        );
    }
}