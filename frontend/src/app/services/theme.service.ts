import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  isDarkMode = signal(false);

  constructor() {
    const saved = localStorage.getItem('dark-mode');
    if (saved !== null) {
      this.isDarkMode.set(saved === 'true');
      this.applyTheme();
    } else {
      this.applyTheme();
    }
  }

  toggleTheme() {
    this.isDarkMode.update(v => !v);
    localStorage.setItem('dark-mode', this.isDarkMode().toString());
    this.applyTheme();
  }

  applyTheme() {
    const body = document.body;
    if (this.isDarkMode()) {
      body.classList.add('dark-theme');
    } else {
      body.classList.remove('dark-theme');
    }
  }

  getLogoPath(): string {
    return this.isDarkMode()
      ? './assets/images/intelligence-dark.png'
      : './assets/images/intelligence.png';
  }
}
