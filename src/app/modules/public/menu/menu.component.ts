import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {NavbarComponent} from "../../shared/navbar/navbar.component";
import {GalleryComponent} from "../gallery/gallery.component";
import {MenuCardsComponent} from "../menu-cards/menu-cards.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, NavbarComponent, GalleryComponent, MenuCardsComponent, NgIf],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  activeTab: 'menu' | 'gallery' = 'menu';

  setActiveTab(tab: 'menu' | 'gallery'): void {
    this.activeTab = tab;
  }
}
