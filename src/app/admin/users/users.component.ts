import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { merge, Subject, Subscription, tap } from 'rxjs';
import { MaterialModule } from '../../shared/modules/material.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UsersService } from './users.service';
import { User } from '../../shared/models/user.model';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule,
    FlexLayoutModule
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})

export class UsersComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  displayedColumns: string[] = ['name', 'email', 'role', 'status', 'created', 'actions'];
  public dataSource: MatTableDataSource<User>;
  public usersTotal: number;
  public noData: User[] = [<User>{}];
  public filterSubject = new Subject<string>();
  public defaultSort: Sort = { active: 'name', direction: 'asc' };

  filter: string = '';
  usersSubcription: Subscription = new Subscription();
  usersSubjectSubcription: Subscription = new Subscription();
  totalSubcription: Subscription = new Subscription();
  paginatorSubscription: Subscription = new Subscription();

  constructor(
    private readonly usersService: UsersService,
  ) { }

  ngOnInit(): void {
    this.usersSubjectSubcription = this.usersService.usersSubject.subscribe(data => {
        this.initializeData(data.users);
        this.usersTotal = data.total;
    });
  }

  public ngAfterViewInit(): void {
    this.paginator.pageIndex = 0;
    this.filter = '';
    this.loadProducts();

    let filter$ = this.filterSubject.pipe(
      tap((value: string) => {
        this.paginator.pageIndex = 0;
        this.filter = value;
      })
    );

    let sort$ = this.sort.sortChange.pipe(tap(() => this.paginator.pageIndex = 0));
    this.paginatorSubscription.add(merge(filter$, sort$, this.paginator.page).pipe(
      tap(() => this.loadProducts())
    ).subscribe());
  }

  private loadProducts(): void {
    let payload = {
      sortDirection: this.sort.direction,
      sortField: this.sort.active,
      pageIndex: this.paginator.pageIndex * this.paginator.pageSize,
      pageSize: this.paginator.pageSize,
      filter: this.filter.toLocaleLowerCase()
    };

    this.usersSubcription = this.usersService.getUsers(payload).subscribe(users => this.initializeData(users));
  }

  private initializeData(users: User[]): void {
    this.dataSource = new MatTableDataSource(users.length ? users : this.noData);
  }

  public ngOnDestroy(): void {
    this.usersSubcription.unsubscribe();
    this.usersSubjectSubcription.unsubscribe();
    this.paginatorSubscription.unsubscribe();
  }

}
