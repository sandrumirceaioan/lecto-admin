import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, merge, Observable, Subject, Subscription, tap } from 'rxjs';
import { SessionsService } from './sessions.service';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent } from '../../shared/components/dialogs/image-dialog/image-dialog.component';
import { Session } from '../../shared/models/session.model';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss']
})
export class SessionsComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  loading$: Observable<boolean>;

  displayedColumns: string[] = ['titlu', 'type', 'details', 'status', 'createdAt', 'createdBy', 'actions'];
  public dataSource: MatTableDataSource<Session>;
  public sessionsTotal: number;
  public noData: Session[] = [<Session>{}];
  public filterSubject = new Subject<string>();
  public defaultSort: Sort = { active: 'titlu', direction: 'asc' };

  filter: string = '';
  sessionsSubcription: Subscription = new Subscription();
  sessionsSubjectSubcription: Subscription = new Subscription();
  totalSubcription: Subscription = new Subscription();
  paginatorSubscription: Subscription = new Subscription();

  constructor(
    private readonly sessionsService: SessionsService,
    private adminService: AdminService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loading$ = this.adminService.loading$;
    this.sessionsSubjectSubcription = this.sessionsService.sessionsSubject.subscribe(data => {
      this.initializeData(data.sessions);
      this.sessionsTotal = data.total;
    });
  }

  public ngAfterViewInit(): void {
    this.paginator.pageIndex = 0;
    this.filter = '';
    this.loadSessions();

    let filter$ = this.filterSubject.pipe(
      debounceTime(500),
      tap((value: string) => {
        this.paginator.pageIndex = 0;
        this.filter = value;
      })
    );

    let sort$ = this.sort.sortChange.pipe(tap(() => this.paginator.pageIndex = 0));
    this.paginatorSubscription.add(merge(filter$, sort$, this.paginator.page).pipe(
      tap(() => this.loadSessions())
    ).subscribe());
  }

  private loadSessions(): void {
    let payload = {
      sortDirection: this.sort.direction,
      sortField: this.sort.active,
      pageIndex: this.paginator.pageIndex * this.paginator.pageSize,
      pageSize: this.paginator.pageSize,
      filter: this.filter.toLocaleLowerCase()
    };

    this.sessionsSubcription = this.sessionsService.getSessions(payload).subscribe(sessions => this.initializeData(sessions));
  }

  private initializeData(sessions: Session[]): void {
    this.dataSource = new MatTableDataSource(sessions.length ? sessions : this.noData);
  }

  getLocationBestOffer(oferte): number {
    return (oferte.reduce((prev, curr) => {
      return prev.valoare < curr.valoare ? prev : curr;
    })).valoare;
  }

  getLocationWorstOffer(oferte): number {
    return (oferte.reduce((prev, curr) => {
      return prev.valoare > curr.valoare ? prev : curr;
    })).valoare;
  }

  public ngOnDestroy(): void {
    this.sessionsSubcription.unsubscribe();
    this.sessionsSubjectSubcription.unsubscribe();
    this.paginatorSubscription.unsubscribe();
  }

}
