import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="snackbar-content" [ngClass]="data.type">
      <mat-icon>{{ data.type === 'success' ? 'check_circle' : 'error' }}</mat-icon>
      <span>{{ data.message }}</span>
    </div>
  `,
  styles: [`
    .snackbar-content {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 16px;
      color: white;
    }

    .success {
      background-color: #4caf50;
    }

    .error {
      background-color: #f44336;
    }

    mat-icon {
      font-size: 20px;
    }
  `]
})
export class CustomSnackbarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}
}
