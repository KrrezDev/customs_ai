import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './modules/shared/navbar/navbar.component';
import { HorrorTransitionComponent } from './modules/shared/horror-transition/horror-transition.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    HorrorTransitionComponent
  ],
  template: `
    <router-outlet></router-outlet>
  `
})
export class AppComponent {}
