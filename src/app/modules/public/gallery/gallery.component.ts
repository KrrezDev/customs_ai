import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CommonModule, NgForOf, NgIf} from "@angular/common";
import {Photo} from "../../../../interfaces/pet.interface";
import {PetService} from "../../../../services/pet.service";
import {catchError, finalize, map, of, tap} from "rxjs";

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    CommonModule
  ],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent implements OnChanges {
  @Input() petId: string | null = null;
  photos: Photo[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private petService: PetService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['petId'] && this.petId) {
      console.log('Loading gallery for pet:', this.petId);
      this.loadGallery(this.petId);
    }
  }

  private loadGallery(petId: string) {
    this.isLoading = true;
    this.error = null;
    this.photos = []; // Limpiar fotos anteriores

    this.petService.getPetGallery(petId).pipe(
      tap(response => {
        console.log('Raw API response:', response); // Para debug
      }),
      map(response => {
        // Verificar si la respuesta es un array
        const galleryImages = Array.isArray(response) ? response : [];
        return galleryImages.filter(image => image && image.imageUrl).map(image => ({
          src: image.imageUrl,
          alt: image.title || image.description || 'Pet photo'
        }));
      }),
      catchError(error => {
        console.error('Error loading gallery:', error);
        this.error = 'Failed to load gallery images';
        return of([]);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (photos) => {
        this.photos = photos;
        console.log('Processed photos array:', this.photos);
      },
      error: (error) => {
        console.error('Subscription error:', error);
        this.error = 'Failed to load gallery images';
        this.photos = [];
      }
    });
  }
}

