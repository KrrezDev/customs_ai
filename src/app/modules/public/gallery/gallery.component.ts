import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CommonModule, NgForOf, NgIf} from "@angular/common";
import {PetGalleryImage, Photo} from "../../../../interfaces/pet.interface";
import {PetService} from "../../../../services/pet.service";
import {catchError, finalize, map, of, tap} from "rxjs";
import {PageResponse} from "../../../../interfaces/pagination.interface";

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
  @Input() petName: string | null = null;
  photos: Photo[] = [];
  isLoading = true;
  error: string | null = null;
  currentPage = 0;
  totalPages = 1;
  pageSize = 6;

  constructor(private petService: PetService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['petId'] && this.petId) {
      this.loadGallery(this.petId, this.currentPage);
    }
  }

  private loadGallery(petId: string, page: number) {
    this.isLoading = true;
    this.error = null;

    this.petService.getPetGallery(petId, page, this.pageSize).subscribe({
      next: (response: PageResponse<PetGalleryImage>) => {
        this.photos = response.content.map(image => ({
          src: image.imageUrl,
          alt: image.title || image.description || 'Pet photo'
        }));
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
      },
      error: (error) => {
        console.error('Subscription error:', error);
        this.error = 'Failed to load gallery images';
        this.photos = [];
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1 && this.petId) {
      this.loadGallery(this.petId, this.currentPage + 1);
    }
  }

  previousPage() {
    if (this.currentPage > 0 && this.petId) {
      this.loadGallery(this.petId, this.currentPage - 1);
    }
  }
}

