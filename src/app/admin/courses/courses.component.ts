import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, merge, Observable, Subject, Subscription, tap } from 'rxjs';
import { CoursesService } from './courses.service';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent } from '../../shared/components/dialogs/image-dialog/image-dialog.component';
import { Course } from '../../shared/models/course.model';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  loading$: Observable<boolean>;

  displayedColumns: string[] = ['imagine', 'titlu', 'pret', 'certificare', 'status', 'createdAt', 'createdBy', 'actions'];
  public dataSource: MatTableDataSource<Course>;
  public coursesTotal: number;
  public noData: Course[] = [<Course>{}];
  public filterSubject = new Subject<string>();
  public defaultSort: Sort = { active: 'titlu', direction: 'asc' };

  filter: string = '';
  coursesSubcription: Subscription = new Subscription();
  coursesSubjectSubcription: Subscription = new Subscription();
  totalSubcription: Subscription = new Subscription();
  paginatorSubscription: Subscription = new Subscription();

  constructor(
    private readonly coursesService: CoursesService,
    private adminService: AdminService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loading$ = this.adminService.loading$;
    this.coursesSubjectSubcription = this.coursesService.coursesSubject.subscribe(data => {
        this.initializeData(data.courses);
        this.coursesTotal = data.total;
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

    this.coursesSubcription = this.coursesService.getCourses(payload).subscribe(courses => this.initializeData(courses));
  }

  private initializeData(courses: Course[]): void {
    this.dataSource = new MatTableDataSource(courses.length ? courses : this.noData);
  }

  // view image
  openDialog(element: any): void {
    this.dialog.open(ImageDialogComponent, {
    data: {
      url: element.imagine.original || element.imagine.small,
      name: element.locatie
    },
    height: 'auto',
    width: 'auto',
    autoFocus: false
  });
}

  public ngOnDestroy(): void {
    this.coursesSubcription.unsubscribe();
    this.coursesSubjectSubcription.unsubscribe();
    this.paginatorSubscription.unsubscribe();
  }

}
