import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { TextInputComponent } from './shared/text-input/text-input.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatSidenavModule, NavbarComponent, SidebarComponent, TextInputComponent],
  template: `
    <mat-sidenav-container class="container">
      <mat-sidenav #sidenav mode="side" opened>
        <app-sidebar></app-sidebar>
      </mat-sidenav>

      <mat-sidenav-content class="content">
        <app-navbar (toggleSidebar)="sidenav.toggle()"></app-navbar>

        <div class="centered-content">
          <app-text-input></app-text-input>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .container {
      height: 100vh;
    }

    .content {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }

    app-navbar {
      flex: 0 0 auto;
    }

    .centered-content {
      flex: 1 1 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1rem;
      background: #f5f5f5;
    }
  `]
})
export class AppComponent {}
