import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkMode.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        this.darkMode.next(savedTheme === 'dark');
        this.updateTheme(savedTheme === 'dark');
      }
    }
  }

  toggleDarkMode(): void {
    if (isPlatformBrowser(this.platformId)) {
      const isDark = !this.darkMode.value;
      this.darkMode.next(isDark);
      this.updateTheme(isDark);
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
  }

  private updateTheme(isDark: boolean): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.toggle('dark-mode', isDark);
    }
  }

  getCurrentTheme(): boolean {
    return this.darkMode.value;
  }
}
