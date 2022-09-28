import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';

import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  isRefresh: boolean = false;

  constructor(public authService: AuthService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    if (this.authService.getAccessToken()) {
      request = this.addToken(request, this.authService.getAccessToken());
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401 && !this.noRefreshRoute(request.url)) {
          return this.handle401Error(request, next);
        } else {
          return throwError(() => error);
        }
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    return this.authService.refresh().pipe(
      switchMap((result: any) => {
        return result ? next.handle(this.addToken(request, result.tokens.access_token)) : of(null);
      }),
      catchError((error: any) => {
        return throwError(() => error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private noRefreshRoute(url: string) {
    const notRefresh = ['login','logout'];
    let urlSegment = url.split('/').pop().trim();
    return notRefresh.includes(urlSegment) ? true : false;
  }
}