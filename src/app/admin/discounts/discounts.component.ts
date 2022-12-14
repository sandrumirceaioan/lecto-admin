import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { debounceTime, merge, Observable, Subject, Subscription, tap } from 'rxjs';
import { MaterialModule } from '../../shared/modules/material.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DiscountsService } from './discounts.service';
import { Discount } from '../../shared/models/discount.model';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-discounts',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './discounts.component.html',
  styleUrls: ['./discounts.component.scss']
})
export class DiscountsComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  loading$: Observable<boolean>;

  displayedColumns: string[] = ['category', 'details', 'status', 'createdAt', 'createdBy', 'actions'];
  public dataSource: MatTableDataSource<Discount>;
  public discountsTotal: number;
  public noData: Discount[] = [<Discount>{}];
  public filterSubject = new Subject<string>();
  public defaultSort: Sort = { active: 'name', direction: 'asc' };

  filter: string = '';
  discountsSubcription: Subscription = new Subscription();
  discountsSubjectSubcription: Subscription = new Subscription();
  totalSubcription: Subscription = new Subscription();
  paginatorSubscription: Subscription = new Subscription();

  constructor(
    private readonly discountsService: DiscountsService,
    private adminService: AdminService,
  ) { }

  ngOnInit(): void {
    this.loading$ = this.adminService.loading$;
    this.discountsSubjectSubcription = this.discountsService.discountsSubject.subscribe(data => {
        this.initializeData(data.discounts);
        this.discountsTotal = data.total;
    });
  }

  public ngAfterViewInit(): void {
    this.paginator.pageIndex = 0;
    this.filter = '';
    this.loadDiscounts();

    let filter$ = this.filterSubject.pipe(
      debounceTime(500),
      tap((value: string) => {
        this.paginator.pageIndex = 0;
        this.filter = value;
      })
    );

    let sort$ = this.sort.sortChange.pipe(tap(() => this.paginator.pageIndex = 0));
    this.paginatorSubscription.add(merge(filter$, sort$, this.paginator.page).pipe(
      tap(() => this.loadDiscounts())
    ).subscribe());
  }

  private loadDiscounts(): void {
    let payload = {
      sortDirection: this.sort.direction,
      sortField: this.sort.active,
      pageIndex: this.paginator.pageIndex * this.paginator.pageSize,
      pageSize: this.paginator.pageSize,
      filter: this.filter.toLocaleLowerCase()
    };

    this.discountsSubcription = this.discountsService.getDiscounts(payload).subscribe(discounts => this.initializeData(discounts));
  }

  private initializeData(users: Discount[]): void {
    this.dataSource = new MatTableDataSource(users.length ? users : this.noData);
  }

  public ngOnDestroy(): void {
    this.discountsSubcription.unsubscribe();
    this.discountsSubjectSubcription.unsubscribe();
    this.paginatorSubscription.unsubscribe();
  }

}
