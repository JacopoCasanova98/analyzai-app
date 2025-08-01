import { Component, EventEmitter, Output, inject, computed, signal, Input } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../auth/services/auth.service';
import { ModalComponent } from '../modal/modal.component';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgClass } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, ModalComponent, MatSlideToggleModule, NgClass],
  template: `
    <mat-toolbar>
      <button mat-icon-button (click)="toggleSidebar.emit()">
        <mat-icon>menu</mat-icon>
      </button>
      <span>AnalyzAI</span>
      <span class="spacer"></span>
      <mat-slide-toggle 
        [checked]="theme.isDarkMode()"
        (change)="theme.toggleTheme()"
        class="theme-toggle"
      >
        <mat-icon [ngClass]="theme.isDarkMode() ? 'icon-light' : 'icon-dark'">
          {{ theme.isDarkMode() ? 'dark_mode' : 'light_mode' }}
        </mat-icon>
      </mat-slide-toggle>
      <button mat-button class="login-button" (click)="onLoginLogoutButtonClicked()">
        {{ loginButtonText() }}
      </button>
    </mat-toolbar>

    <app-modal
      [isOpen]="showLogoutModal()"
      title="Are you sure?"
      (close)="cancelLogout()"
      [logoPath]="theme.getLogoPath()"
    >
      <div class="logout-form">
        <button mat-raised-button (click)="confirmLogout()">
          Logout
        </button>

        <div class="or-separator">
          <div class="line"></div>
          <span>OR</span>
          <div class="line"></div>
        </div>

        <button mat-raised-button (click)="cancelLogout()">
          Cancel
        </button>
      </div>
    </app-modal>
  `,
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() openLogin = new EventEmitter<void>();
  @Output() themeToggled = new EventEmitter<'light' | 'dark'>();

  private authService = inject(AuthService);
  private snackbar = inject(SnackbarService);
  theme = inject(ThemeService);

  isLogged = signal(false);
  showLogoutModal = signal(false);
  loginButtonText = computed(() => this.isLogged() ? 'Logout' : 'Login');

  constructor() {
    this.authService.isLoggedIn$.subscribe(logged => {
      this.isLogged.set(logged);
    });
  }

  onLoginLogoutButtonClicked() {
    if (this.isLogged()) {
      this.showLogoutModal.set(true);
    } else {
      this.openLogin.emit();
    }
  }

  confirmLogout() {
    this.authService.logout();
    this.showLogoutModal.set(false);
    this.snackbar.showSuccess('Logout successful');
  }

  cancelLogout() {
    this.showLogoutModal.set(false);
  }
}
