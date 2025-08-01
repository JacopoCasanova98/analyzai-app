import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from '../../shared/modal/modal.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RegisterComponent } from '../register/register.component';
import { AuthService } from '../services/auth.service';
import { SnackbarService } from '../../services/snackbar/snackbar.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalComponent,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RegisterComponent
  ],
  template: `
    <app-modal [title]="isSignUp ? 'Register' : 'Login'" [isOpen]="isOpen" (close)="closeModal()" [logoPath]="logoPath">

      <form *ngIf="!isSignUp" [formGroup]="loginForm" (ngSubmit)="submit()" class="login-form">
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" />
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Password</mat-label>
          <input matInput type="password" formControlName="password" />
        </mat-form-field>

        <button mat-raised-button type="submit" [disabled]="loginForm.invalid">
          Login
        </button>

        <div class="or-separator">
          <div class="line"></div>
          <span>OR</span>
          <div class="line"></div>
        </div>

        <button mat-raised-button type="button" (click)="loginSignUpToggle()">
          Sign Up
        </button>
      </form>

      <app-register
        *ngIf="isSignUp"
        [logoPath]="logoPath"
        (switchToLogin)="loginSignUpToggle()"
        (closeModal)="closeModal()">
      </app-register>

    </app-modal>
  `,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @Input() isOpen = false;
  @Input() logoPath: string = './assets/images/intelligence-dark.png';
  @Output() close = new EventEmitter<void>();

  isSignUp = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  constructor(private authService: AuthService, private snackbarService: SnackbarService) {}

  closeModal() {
    this.close.emit();
  }

  submit() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;
    this.authService.login(email!, password!).subscribe({
      next: () => {
        this.snackbarService.showSuccess('Login success');
        this.closeModal();
      },
      error: err => {
        console.error('Login error:', err);
        this.snackbarService.showError('Login failed');
      }
    });
  }

  loginSignUpToggle() {
    this.isSignUp = !this.isSignUp;
  }
}
