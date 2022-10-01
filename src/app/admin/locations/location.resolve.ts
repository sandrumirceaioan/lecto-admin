import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { forkJoin, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LocationsService } from './locations.service';

@Injectable()
export class LocationResolve implements Resolve<any> {
    constructor(
        private locationsService: LocationsService,
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const locationId = route.params['id'];

        return forkJoin({
            location: this.locationsService.getLocationById(locationId),
        }).pipe(
            map((result: any) => {
                return result;
            }),
            catchError((error) => {
                console.error('LOCATION RESOLVE ERROR: ', error);
                return throwError(() => error.error);
            })
        );
    }
}