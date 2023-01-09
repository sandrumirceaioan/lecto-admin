import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Location } from '../../shared/models/location.model';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, merge, Observable, Subject, Subscription, tap } from 'rxjs';
import { LocationsService } from './locations.service';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent } from '../../shared/components/dialogs/image-dialog/image-dialog.component';
import { AdminService } from '../admin.service';
import { Resort } from '../../shared/models/resort.model';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: false }) sort2: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator2: MatPaginator;

  loading$: Observable<boolean>;

  displayedColumns2: string[] = ['imagine', 'locatie', 'resort', 'status', 'createdAt', 'createdBy', 'actions'];
  public dataSource2: MatTableDataSource<Location>;
  public locationsTotal: number;
  public noData2: Location[] = [<Location>{}];
  public filterSubject2 = new Subject<string>();
  public defaultSort2: Sort = { active: 'locatie', direction: 'asc' };

  filter2: string = '';

  locationsSubcription: Subscription = new Subscription();
  locationsSubjectSubcription: Subscription = new Subscription();
  paginatorSubscription2: Subscription = new Subscription();

  constructor(
    private readonly locationsService: LocationsService,
    private adminService: AdminService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loading$ = this.adminService.loading$;
    this.locationsSubjectSubcription = this.locationsService.locationsSubject.subscribe(data => {
        this.initializeData2(data.locations);
        this.locationsTotal = data.total;
    });
  }

  public ngAfterViewInit(): void {
    this.paginator2.pageIndex = 0;
    this.filter2 = '';
    this.loadLocations();

    let filter2$ = this.filterSubject2.pipe(
      debounceTime(500),
      tap((value: string) => {
        this.paginator2.pageIndex = 0;
        this.filter2 = value;
      })
    );

    let sort2$ = this.sort2.sortChange.pipe(tap(() => this.paginator2.pageIndex = 0));

    this.paginatorSubscription2.add(merge(filter2$, sort2$, this.paginator2.page).pipe(
      tap(() => this.loadLocations())
    ).subscribe());
  }

  private loadLocations(): void {
    let payload = {
      sortDirection: this.sort2.direction,
      sortField: this.sort2.active,
      pageIndex: this.paginator2.pageIndex * this.paginator2.pageSize,
      pageSize: this.paginator2.pageSize,
      filter: this.filter2.toLocaleLowerCase()
    };

    this.locationsSubcription = this.locationsService.getLocations(payload).subscribe(locations => this.initializeData2(locations));
  }

  private initializeData2(locations: Location[]): void {
    this.dataSource2 = new MatTableDataSource(locations.length ? locations : this.noData2);
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
    this.paginatorSubscription2.unsubscribe();
  }

}
