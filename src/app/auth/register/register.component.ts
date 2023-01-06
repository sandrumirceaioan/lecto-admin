import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterForm } from '../../shared/models/forms.model';
import { AuthService } from '../../shared/services/auth.service';
import { MaterialModule } from 'src/app/shared/modules/material.module';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  showPasswordText: boolean = false;
  showRPasswordText: boolean = false;

  registerForm = new FormGroup<RegisterForm>({
    firstName: new FormControl(null, [Validators.required]),
    lastName: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
    passwordRepeat: new FormControl(null, [Validators.required, Validators.minLength(8)]),
  });

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {

  }

  register(): void {
    this.authService.register({
      firstName: this.registerForm.value.firstName,
      lastName: this.registerForm.value.lastName,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      passwordRepeat: this.registerForm.value.passwordRepeat
    }).subscribe((result) => {
      this.router.navigate(['/auth/login']);
    })
  }

}
