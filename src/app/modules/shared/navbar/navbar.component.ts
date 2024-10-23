import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {Observable} from "rxjs";
import {isPlatformBrowser} from "@angular/common";
import {ThemeService} from "../../../../services/theme.service";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  isDarkMode$: Observable<boolean>;

  constructor(
    private themeService: ThemeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isDarkMode$ = this.themeService.darkMode$;
  }

  ngOnInit() {}

  toggleDarkMode() {
    if (isPlatformBrowser(this.platformId)) {
      this.themeService.toggleDarkMode();
    }
  }
}
