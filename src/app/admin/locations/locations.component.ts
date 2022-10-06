import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Location } from '../../shared/models/location.model';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, merge, Observable, Subject, Subscription, tap } from 'rxjs';
import { LocationsService } from './locations.service';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent } from '../../shared/components/dialogs/image-dialog/image-dialog.component';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule,
    FlexLayoutModule
  ],
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  loading$: Observable<boolean>;

  displayedColumns: string[] = ['imagine', 'locatie', 'oras', 'status', 'createdAt', 'createdBy', 'actions'];
  public dataSource: MatTableDataSource<Location>;
  public locationsTotal: number;
  public noData: Location[] = [<Location>{}];
  public filterSubject = new Subject<string>();
  public defaultSort: Sort = { active: 'locatie', direction: 'asc' };

  filter: string = '';
  locationsSubcription: Subscription = new Subscription();
  locationsSubjectSubcription: Subscription = new Subscription();
  totalSubcription: Subscription = new Subscription();
  paginatorSubscription: Subscription = new Subscription();

  constructor(
    private readonly locationsService: LocationsService,
    private adminService: AdminService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loading$ = this.adminService.loading$;
    this.locationsSubjectSubcription = this.locationsService.locationsSubject.subscribe(data => {
        this.initializeData(data.locations);
        this.locationsTotal = data.total;
    });
  }

  public ngAfterViewInit(): void {
    this.paginator.pageIndex = 0;
    this.filter = '';
    this.loadLocations();

    let filter$ = this.filterSubject.pipe(
      debounceTime(500),
      tap((value: string) => {
        this.paginator.pageIndex = 0;
        this.filter = value;
      })
    );

    let sort$ = this.sort.sortChange.pipe(tap(() => this.paginator.pageIndex = 0));
    this.paginatorSubscription.add(merge(filter$, sort$, this.paginator.page).pipe(
      tap(() => this.loadLocations())
    ).subscribe());
  }

  private loadLocations(): void {
    let payload = {
      sortDirection: this.sort.direction,
      sortField: this.sort.active,
      pageIndex: this.paginator.pageIndex * this.paginator.pageSize,
      pageSize: this.paginator.pageSize,
      filter: this.filter.toLocaleLowerCase()
    };

    this.locationsSubcription = this.locationsService.getLocations(payload).subscribe(locations => this.initializeData(locations));
  }

  private initializeData(locations: Location[]): void {
    this.dataSource = new MatTableDataSource(locations.length ? locations : this.noData);
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
    this.locationsSubcription.unsubscribe();
    this.locationsSubjectSubcription.unsubscribe();
    this.paginatorSubscription.unsubscribe();
  }

}
