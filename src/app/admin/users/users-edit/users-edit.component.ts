import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../../shared/modules/material.module';
import { Subscription } from 'rxjs';
import { UsersService } from '../users.service';
import { User } from '../../../shared/models/user.model';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-categories-edit',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    FlexLayoutModule,
    ReactiveFormsModule
  ],
  templateUrl: './users-edit.component.html',
  styleUrls: ['./users-edit.component.scss']
})
export class UsersEditComponent implements OnInit, OnDestroy {
  updateUserSubscription: Subscription = new Subscription();
  user: User;
  userForm: FormGroup;
  isSelf: boolean;

  showPasswordText: boolean = true;
  showRPasswordText: boolean = true;

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.user = this.route.snapshot.data['data'].user;
    this.isSelf = this.authService.currentUser._id === this.user._id ? true : false;

    this.userForm = this.fb.group({
      firstName: new FormControl({ value: this.user.firstName ? this.user.firstName : null, disabled: this.user.role === 'admin' && !this.isSelf ? true : false }, [Validators.required]),
      lastName: new FormControl({ value: this.user.lastName ? this.user.lastName : null, disabled: this.user.role === 'admin' && !this.isSelf ? true : false }, [Validators.required]),
      email: new FormControl({ value: this.user.email ? this.user.email : null, disabled: this.user.role === 'admin' && !this.isSelf ? true : false }, [Validators.required]),
      role: new FormControl({ value: this.user.role ? this.user.role : null, disabled: this.user.role === 'admin' ? true : false }, [Validators.required]),
      status: new FormControl({ value: this.user.status ? this.user.status : (this.user.status === false ? false : null), disabled: this.isSelf || this.user.role === 'admin' }, [Validators.required]),
    });
  }

  updateCategory() {
    this.updateUserSubscription = this.usersService
      .updateUserById(this.user._id, this.userForm.value)
      .subscribe(() => this.router.navigate(['/admin/utilizatori']));
  }

  ngOnDestroy(): void {
    this.updateUserSubscription.unsubscribe();
  }

}
