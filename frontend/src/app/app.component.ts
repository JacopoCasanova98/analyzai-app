import { Component, OnInit, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { TextInputComponent } from './shared/text-input/text-input.component';
import { LoginComponent } from './auth/login/login.component';
import { CommonModule } from '@angular/common';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { EmotionResponse } from './models/emotion-response.model';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatCardModule,
    NavbarComponent,
    SidebarComponent,
    TextInputComponent,
    LoginComponent,
    MatIconModule,
  ],
  template: `
    <mat-sidenav-container class="container">
      <mat-sidenav #sidenav mode="side" [opened]="!isScreenSmall" class="custom-sidenav">
        <app-sidebar (itemClicked)="handleHistoryClick($event)"></app-sidebar>
      </mat-sidenav>

      <mat-sidenav-content class="content">
        <app-navbar
          (toggleSidebar)="sidenav.toggle()"
          (openLogin)="isLoginModalOpen = true"
          (themeToggled)="toggleTheme()">
        </app-navbar>

        <div class="centered-content">
          <div class="tex-input">

          <div class="title-container">
            <img [src]="logoPath" alt="AnalyzeAI Logo" class="title-logo" />
            <h3 class="title">{{ typedTitle }}</h3>
          </div>

          <app-text-input (showResponse)="handleResponse($event)"></app-text-input>

          </div>

          <div class="response-card" [class.visible]="response">
            <mat-card>
              <mat-card-content class="card-content">
                <h5 class="card-title">Emotion detected:</h5>
                <h6 class="card-emotion">{{ getEmoji(response) }} {{ response || '\u00A0' }}</h6>
              </mat-card-content>
            </mat-card>
          </div>

        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>

    <app-login
      *ngIf="isLoginModalOpen"
      [isOpen]="isLoginModalOpen"
      [logoPath]="logoPath"
      (close)="isLoginModalOpen = false">
    </app-login>

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
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 1rem;
      gap: 5rem;
      background-color: var(--background-color);
      color: var(--text-color);
    }

    .title-container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      height: 3.5rem;
    }

    .title-logo {
      width: 3rem;
      height: 3rem;
      object-fit: contain;
      display: block;
    }

    .title {
      line-height: 3.5rem;
      margin: 0;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      animation: blinkCursor 0.7s steps(1) infinite;
    }

    .tex-input {
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }

    .card-emotion {
      text-align: center
    }

    .response-card {
      min-height: 80px;
      width: auto;
      max-width: 90vw;
      z-index: 1000;
      border: 1px solid var(--text-color);
      box-shadow: 0 1px 3px var(--text-color);

      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
      border-radius: 8px;
    }

    .response-card.visible {
      opacity: 1;
      pointer-events: auto;
    }

    mat-card {
      padding: 1rem 2rem;
      box-sizing: border-box;
      background-color: var(--background-color);
      color: var(--text-color);
    }

    .card-title {
      font-weight: 600;
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
    }

    .card-emotion {
      font-size: 1.5rem;
      text-align: center;
      background-color: var(--background-color);
      color: var(--text-color);
    }

    .custom-sidenav {
      background-color: var(--background-sidebar);
      border-right: 1px solid black;
      color: var(--text-color);
      border-radius: 0;
      overflow-y: auto;
      scrollbar-width: thin;          
      scrollbar-color: var(--background-color) transparent; 
    }

    .custom-sidenav::-webkit-scrollbar {
      width: 6px;
    }

    .custom-sidenav::-webkit-scrollbar-track {
      background: transparent;
    }

    .custom-sidenav::-webkit-scrollbar-thumb {
      background-color: var(--text-color);
      border-radius: 10px;
      border: 2px solid transparent;
      background-clip: content-box;
    }

    @keyframes blinkCursor {
      0%, 50% {
        border-color: black;
      }
      51%, 100% {
        border-color: transparent;
      }
    }
  `]
})
export class AppComponent implements OnInit {

  private theme = inject(ThemeService);

  get isDarkMode() {
    return this.theme.isDarkMode();
  }

  get logoPath() {
    return this.theme.getLogoPath();
  }

  isLoginModalOpen = false;
  isScreenSmall = false;

  fullTitle = 'AnalyzeAI';
  typedTitle = '';

  response: string = '';
  prefillText: string = '';

  ngOnInit() {
    this.isScreenSmall = window.matchMedia('(max-width: 768px)').matches;
    this.typeWriterEffect();
    this.theme.applyTheme();
  }

  toggleTheme() {
    this.theme.toggleTheme();
  }

  getEmoji(emotion: string): string {
    switch(emotion) {
      case 'anger': return '😠🔥';
      case 'disgust': return '🤢';
      case 'fear': return '😨😱';
      case 'joy': return '😄✨';
      case 'neutral': return '😐';
      case 'sadness': return '😢💧';
      case 'surprise': return '😲🎉';
      default: return '';
    }
  }


  typeWriterEffect() {
    const chars = this.fullTitle.split('');
    const source = interval(100).pipe(take(chars.length));

    source.subscribe(i => {
      this.typedTitle += chars[i];
    });
  }

  handleResponse(res: EmotionResponse) {
    this.response = '';
    setTimeout(() => {
      this.response = res.emotion;
    }, 200);
  }

  handleHistoryClick(text: string) {
    this.prefillText = text;
  }

}
