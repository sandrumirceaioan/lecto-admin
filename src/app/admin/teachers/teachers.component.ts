import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { merge, Subject, Subscription, tap } from 'rxjs';
import { TeachersService } from './teachers.service';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent } from '../../shared/components/dialogs/image-dialog/image-dialog.component';
import { Teacher } from '../../shared/models/teacher.model';

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule,
    FlexLayoutModule
  ],
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.scss']
})
export class TeachersComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  displayedColumns: string[] = ['imagine', 'nume', 'experienta', 'email', 'createdAt', 'createdBy', 'actions'];
  public dataSource: MatTableDataSource<Teacher>;
  public teachersTotal: number;
  public noData: Teacher[] = [<Teacher>{}];
  public filterSubject = new Subject<string>();
  public defaultSort: Sort = { active: 'nume', direction: 'asc' };

  filter: string = '';
  teachersSubcription: Subscription = new Subscription();
  teachersSubjectSubcription: Subscription = new Subscription();
  totalSubcription: Subscription = new Subscription();
  paginatorSubscription: Subscription = new Subscription();

  constructor(
    private readonly teachersService: TeachersService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.teachersSubjectSubcription = this.teachersService.teachersSubject.subscribe(data => {
        this.initializeData(data.teachers);
        this.teachersTotal = data.total;
    });
  }

  public ngAfterViewInit(): void {
    this.paginator.pageIndex = 0;
    this.filter = '';
    this.loadTeachers();

    let filter$ = this.filterSubject.pipe(
      tap((value: string) => {
        this.paginator.pageIndex = 0;
        this.filter = value;
      })
    );

    let sort$ = this.sort.sortChange.pipe(tap(() => this.paginator.pageIndex = 0));
    this.paginatorSubscription.add(merge(filter$, sort$, this.paginator.page).pipe(
      tap(() => this.loadTeachers())
    ).subscribe());
  }

  private loadTeachers(): void {
    let payload = {
      sortDirection: this.sort.direction,
      sortField: this.sort.active,
      pageIndex: this.paginator.pageIndex * this.paginator.pageSize,
      pageSize: this.paginator.pageSize,
      filter: this.filter.toLocaleLowerCase()
    };

    this.teachersSubcription = this.teachersService.getTeachers(payload).subscribe(teachers => this.initializeData(teachers));
  }

  private initializeData(teachers: Teacher[]): void {
    this.dataSource = new MatTableDataSource(teachers.length ? teachers : this.noData);
  }

  // view image
  openDialog(element: any): void {
    if (!element.imagine || !element.imagine.original) return;

    this.dialog.open(ImageDialogComponent, {
    data: {
      url: element.imagine.original || element.imagine.small,
      name: element.nume
    },
    height: 'auto',
    maxHeight: '90vh',
    width: 'auto',
    maxWidth: '90%',
    autoFocus: false
  });
}

  public ngOnDestroy(): void {
    this.teachersSubcription.unsubscribe();
    this.teachersSubjectSubcription.unsubscribe();
    this.paginatorSubscription.unsubscribe();
  }

}
