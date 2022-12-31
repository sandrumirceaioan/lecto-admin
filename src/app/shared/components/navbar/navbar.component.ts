import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MaterialModule } from '../../modules/material.module';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule
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
