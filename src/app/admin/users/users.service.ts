import {
  HttpClient,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertService } from '@full-fledged/alerts';
import { catchError, map, Observable, throwError, Subject } from 'rxjs';
import { User } from '../../shared/models/user.model';
import { environment } from '../../../environments/environment';
import { AdminService } from '../admin.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  apiPath: string = environment.BACKEND_URL;
  users: User[];
  usersSubject: Subject<{ users: User[], total: number }> = new Subject();


  constructor(
    private http: HttpClient, 
    private alertService: AlertService,
    private adminService: AdminService
    ) {}

  getUsers(payload?: any): Observable<User[]> {
    this.adminService.setLoading(true);
    let params = new HttpParams();

    if (payload.pageIndex) params = params.append('skip', payload.pageIndex.toString());
    if (payload.pageSize) params = params.append('limit', payload.pageSize.toString());
    if (payload.sortField) params = params.append('sort', payload.sortField);
    if (payload.sortDirection) params = params.append('direction', payload.sortDirection);
    if (payload.filter) params = params.append('search', payload.filter.toString());


    return this.http.get(`${this.apiPath}/users/paginated`, { params }).pipe(
      map((result: any) => {
        this.adminService.setLoading(false);
        this.usersSubject.next(result);
        return result.users;
      }),
      catchError((error) => {
        this.adminService.setLoading(false);
        this.alertService.danger(error.error.message);
        return throwError(() => error.error);
      })
    );
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get(`${this.apiPath}/users`).pipe(
      map((result: any) => {
        this.users = result;
        return result;
      }),
      catchError((error) => {
        this.alertService.danger(error.error.message);
        return throwError(() => error.error);
      })
    );
  }

  createUser(data): Observable<User> {
    this.adminService.setLoading(true);
    return this.http.post(`${this.apiPath}/users/create`, data).pipe(
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

  getUserById(id): Observable<User> {
    return this.http.get(`${this.apiPath}/users/${id}`).pipe(
      map((result: any) => {
        return result;
      }),
      catchError((error) => {
        this.alertService.danger(error.error.message);
        return throwError(() => error.error);
      })
    );
  }

  updateUserById(id, data): Observable<User> {
    this.adminService.setLoading(true);
    return this.http.put(`${this.apiPath}/users/${id}`, data).pipe(
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
