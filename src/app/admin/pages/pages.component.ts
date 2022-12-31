import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, merge, Observable, Subject, Subscription, tap } from 'rxjs';
import { PagesService } from './pages.service';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent } from '../../shared/components/dialogs/image-dialog/image-dialog.component';
import { AdminService } from '../admin.service';
import { Page } from '../../shared/models/page.model';

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  loading$: Observable<boolean>;

  displayedColumns: string[] = ['imagine', 'titlu', 'status', 'createdAt', 'createdBy', 'actions'];
  public dataSource: MatTableDataSource<Page>;
  public pagesTotal: number;
  public noData: Page[] = [<Page>{}];
  public filterSubject = new Subject<string>();
  public defaultSort: Sort = { active: 'titlu', direction: 'asc' };

  filter: string = '';
  pagesSubcription: Subscription = new Subscription();
  pagesSubjectSubcription: Subscription = new Subscription();
  totalSubcription: Subscription = new Subscription();
  paginatorSubscription: Subscription = new Subscription();

  constructor(
    private readonly pagesService: PagesService,
    private adminService: AdminService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loading$ = this.adminService.loading$;
    this.pagesSubjectSubcription = this.pagesService.pagesSubject.subscribe(data => {
        this.initializeData(data.pages);
        this.pagesTotal = data.total;
    });
  }

  public ngAfterViewInit(): void {
    this.paginator.pageIndex = 0;
    this.filter = '';
    this.loadCourses();

    let filter$ = this.filterSubject.pipe(
      debounceTime(500),
      tap((value: string) => {
        this.paginator.pageIndex = 0;
        this.filter = value;
      })
    );

    let sort$ = this.sort.sortChange.pipe(tap(() => this.paginator.pageIndex = 0));
    this.paginatorSubscription.add(merge(filter$, sort$, this.paginator.page).pipe(
      tap(() => this.loadCourses())
    ).subscribe());
  }

  private loadCourses(): void {
    let payload = {
      sortDirection: this.sort.direction,
      sortField: this.sort.active,
      pageIndex: this.paginator.pageIndex * this.paginator.pageSize,
      pageSize: this.paginator.pageSize,
      filter: this.filter.toLocaleLowerCase()
    };

    this.pagesSubcription = this.pagesService.getPages(payload).subscribe(pages => this.initializeData(pages));
  }

  private initializeData(pages: Page[]): void {
    this.dataSource = new MatTableDataSource(pages.length ? pages : this.noData);
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
    this.pagesSubcription.unsubscribe();
    this.pagesSubjectSubcription.unsubscribe();
    this.paginatorSubscription.unsubscribe();
  }

}
