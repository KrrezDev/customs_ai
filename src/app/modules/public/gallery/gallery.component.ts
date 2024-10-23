import {Component, Input, OnInit} from '@angular/core';
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
export class GalleryComponent implements OnInit {
  photos: Photo[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private petService: PetService) {}

  ngOnInit() {
    const petId = '67184a07a34fed66b08ead3a';
    this.loadGallery(petId);
  }

  private loadGallery(petId: string) {
    this.isLoading = true;
    this.error = null;

    this.petService.getPetGallery(petId).pipe(
      map(galleryImages => galleryImages
        .filter(image => image.imageUrl)
        .map(image => ({
          src: image.imageUrl,
          alt: image.title || image.description || 'Pet photo'
        }))
      ),
      tap(photos => {
        console.log('Mapped photos:', photos);
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
        console.log('Final photos array:', this.photos);
      },
      error: (error) => {
        console.error('Subscription error:', error);
        this.error = 'Failed to load gallery images';
      }
    });
  }
}
