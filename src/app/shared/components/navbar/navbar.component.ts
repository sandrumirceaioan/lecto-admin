import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { last, map, Observable, Subscription, take } from 'rxjs';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MaterialModule } from '../../modules/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    RouterModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() sidenav;
  @Input() mobile;
  @Input() themeColor;
  @Input() currentRoute;
  user: User;
  routeSubscription: Subscription;

  constructor(
    private authService: AuthService
  ) {

  }

  ngOnInit() {
    this.user = this.authService.currentUser;
  }


  logout() {
    this.authService.logout();
  }


}
