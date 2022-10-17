import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { forkJoin, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PagesService } from './pages.service';

@Injectable()
export class PageResolve implements Resolve<any> {
    constructor(
        private pagesService: PagesService,
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const pageId = route.params['id'];

        return forkJoin({
            page: this.pagesService.getPageById(pageId),
        }).pipe(
            map((result: any) => {
                return result;
            }),
            catchError((error) => {
                console.error('PAGE RESOLVE ERROR: ', error);
                return throwError(() => error.error);
            })
        );
    }
}