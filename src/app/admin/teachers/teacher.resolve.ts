import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { forkJoin, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TeachersService } from './teachers.service';

@Injectable()
export class TeacherResolve implements Resolve<any> {
    constructor(
        private teachersService: TeachersService,
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const teacherId = route.params['id'];

        return forkJoin({
            teacher: this.teachersService.getTeacherById(teacherId),
        }).pipe(
            map((result: any) => {
                return result;
            }),
            catchError((error) => {
                console.error('TEACHER RESOLVE ERROR: ', error);
                return throwError(() => error.error);
            })
        );
    }
}