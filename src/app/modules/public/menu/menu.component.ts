import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {NavbarComponent} from "../../shared/navbar/navbar.component";
import {GalleryComponent} from "../gallery/gallery.component";
import {MenuCardsComponent} from "../menu-cards/menu-cards.component";
import {NgIf} from "@angular/common";
import {InstructionsComponent} from "../intructions/instructions.component";

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, NavbarComponent, GalleryComponent, MenuCardsComponent, NgIf, InstructionsComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  activeTab: 'menu' | 'gallery' = 'menu';
  selectedPetId: string | null = null;
  showInstructions = true;

  setActiveTab(tab: 'menu' | 'gallery'): void {
    this.activeTab = tab;
  }

  onGallerySelected(petId: string): void {
    this.selectedPetId = petId;
    this.setActiveTab('gallery');
  }
  closeInstructions(): void {
    this.showInstructions = false;
  }
}
