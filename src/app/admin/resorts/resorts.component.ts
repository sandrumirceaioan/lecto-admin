import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, merge, Observable, Subject, Subscription, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent } from '../../shared/components/dialogs/image-dialog/image-dialog.component';
import { AdminService } from '../admin.service';
import { Resort } from '../../shared/models/resort.model';
import { ResortsService } from './resorts.service';

@Component({
  selector: 'app-resorts',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './resorts.component.html',
  styleUrls: ['./resorts.component.scss']
})
export class ResortsComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: false }) sort1: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator1: MatPaginator;

  loading$: Observable<boolean>;

  displayedColumns1: string[] = ['imagine', 'resort', 'oras', 'status', 'createdAt', 'createdBy', 'actions'];
  public dataSource1: MatTableDataSource<Resort>;

  public resortsTotal: number;
  public noData1: Resort[] = [<Resort>{}];
  public filterSubject1 = new Subject<string>();
  public defaultSort1: Sort = { active: 'resort', direction: 'asc' };

  filter1: string = '';

  resortsSubcription: Subscription = new Subscription();
  resortsSubjectSubcription: Subscription = new Subscription();
  paginatorSubscription1: Subscription = new Subscription();

  constructor(
    private readonly resortsService: ResortsService,
    private adminService: AdminService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loading$ = this.adminService.loading$;
    this.resortsSubjectSubcription = this.resortsService.resortsSubject.subscribe(data => {
      this.initializeData1(data.resorts);
      this.resortsTotal = data.total;
  });
  }

  public ngAfterViewInit(): void {
    this.paginator1.pageIndex = 0;
    this.filter1 = '';
    this.loadResorts();

    let filter1$ = this.filterSubject1.pipe(
      debounceTime(500),
      tap((value: string) => {
        this.paginator1.pageIndex = 0;
        this.filter1 = value;
      })
    );

    let sort1$ = this.sort1.sortChange.pipe(tap(() => this.paginator1.pageIndex = 0));

    this.paginatorSubscription1.add(merge(filter1$, sort1$, this.paginator1.page).pipe(
      tap(() => this.loadResorts())
    ).subscribe());
  }

  private loadResorts(): void {
    let payload = {
      sortDirection: this.sort1.direction,
      sortField: this.sort1.active,
      pageIndex: this.paginator1.pageIndex * this.paginator1.pageSize,
      pageSize: this.paginator1.pageSize,
      filter: this.filter1.toLocaleLowerCase()
    };

    this.resortsSubcription = this.resortsService.getResorts(payload).subscribe(resorts => this.initializeData1(resorts));
  }

  private initializeData1(resorts: Resort[]): void {
    this.dataSource1 = new MatTableDataSource(resorts.length ? resorts : this.noData1);
  }

  // view image
  openDialog(element: any): void {
    this.dialog.open(ImageDialogComponent, {
    data: {
      url: element.imagine.original || element.imagine.small,
      name: element.locatie
    },
    height: 'auto',
    maxHeight: '90vh',
    width: 'auto',
    maxWidth: '90%',
    autoFocus: false
  });
}

  public ngOnDestroy(): void {
    this.resortsSubcription.unsubscribe();
    this.resortsSubjectSubcription.unsubscribe();
    this.paginatorSubscription1.unsubscribe();
  }

}
