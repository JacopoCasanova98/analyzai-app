import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { SnackbarService } from '../../services/snackbar/snackbar.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="register()" class="login-form">
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Email</mat-label>
        <input matInput formControlName="email" />
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Password</mat-label>
        <input matInput type="password" formControlName="password" />
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Confirm Password</mat-label>
        <input matInput type="password" formControlName="confirmPassword" />
      </mat-form-field>

      <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
        Sign Up
      </button>

      <div class="or-separator">
        <div class="line"></div>
        <span>OR</span>
        <div class="line"></div>
      </div>

      <button mat-raised-button color="accent" type="button" (click)="switchToLogin.emit()">
        Login
      </button>
    </form>
  `,
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  @Output() switchToLogin = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();
 
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackbarService: SnackbarService 
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  register() {
    if (this.form.valid) {
      const { email, password, confirmPassword } = this.form.value;

      if (password !== confirmPassword) {
        this.snackbarService.showError('Passwords do not match');
        return;
      }

      this.authService.register(email, password).subscribe({
        next: () => {
          this.snackbarService.showSuccess('Registration successful');
          this.authService.login(email, password).subscribe({
            next: () => {
              this.switchToLogin.emit();
              this.closeModal.emit();
            },
            error: () => {
              this.snackbarService.showError('Auto-login failed');
            }
          });
        },
        error: () => {
          this.snackbarService.showError('Registration failed');
        }
      });      
    }
  }
}
