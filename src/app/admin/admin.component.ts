import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from './admin.service';
import { MaterialModule } from '../shared/modules/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MediaMatcher } from '@angular/cdk/layout';
import { SideMenuItem } from '../shared/models/layout.model';
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';
import { filter, last, map, Observable, of, Subscription, tap } from 'rxjs';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    PerfectScrollbarModule,
    NavbarComponent
  ],
  providers: [
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  menuItems: SideMenuItem[];
  loading$: Observable<boolean>;
  currentRouteSubscription: Subscription;
  currentRoute: string;

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    this.menuItems = this.adminService.getMenuItems();
    this.mobileQuery = media.matchMedia("(max-width: 600px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    this.currentRouteSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        return this.getRouteTitle(this.route.firstChild);
      })
    ).subscribe((title: string) => {
      this.currentRoute = title;
    });
  }

  ngOnInit(): void {
    this.loading$ = this.adminService.loading$;
  }


  getRouteTitle(child) {
    while (child) {
      if (child.firstChild) {
        child = child.firstChild;
      } else if (child.snapshot.data && child.snapshot.data['title']) {
        return child.snapshot.data['title'];
      } else {
        return null;
      }
    }
    return null;
  }

  ngOnDestroy(): void {
    this.currentRouteSubscription.unsubscribe();
  }



  back(): void {
    this.location.back()
  }

}