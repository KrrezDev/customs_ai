import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {AddPetModalComponent} from "../add-pet-modal/add-pet-modal.component";
import {Pet} from "../../../../interfaces/pet.interface";
import {PetService} from "../../../../services/pet.service";
import {PaginationComponent} from "../pagination/pagination.component";
interface MenuItem {
  name: string;
  items: string[];
}
@Component({
  selector: 'app-menu-cards',
  standalone: true,
  imports: [
    NgForOf,
    AddPetModalComponent,
    NgIf,
    PaginationComponent
  ],
  templateUrl: './menu-cards.component.html',
  styleUrl: './menu-cards.component.scss'
})
export class MenuCardsComponent implements OnInit {
  pets: Pet[] = [];
  showAddPetModal = false;
  selectedPet: Pet | null = null;
  loadingPetIds: Set<string> = new Set();
  showGalleryModal = false;
  selectedPetId: string | null = null;
  @Output() gallerySelected = new EventEmitter<string>();

  currentPage = 1;
  totalPages = 1;
  pageSize = 3;
  totalItems = 0;

  constructor(private petService: PetService) {}

  ngOnInit(): void {
    this.loadPets();
    this.petService.getPets(1, 1000).subscribe(allPets => {
      this.totalItems = allPets.length;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    });
  }

  loadPets(): void {
    this.petService.getPets(this.currentPage, this.pageSize).subscribe({
      next: (pets) => {
        console.log('Pets received:', pets);
        if (Array.isArray(pets)) {
          this.pets = pets;
          // Si no tenemos totalPages, lo calculamos
          if (this.totalPages === 1) {
            this.totalPages = Math.ceil(pets.length / this.pageSize);
          }
        } else {
          console.error('Invalid response format:', pets);
          this.pets = [];
        }
      },
      error: (error) => {
        console.error('Error loading pets:', error);
        this.pets = [];
      }
    });
  }

  private validatePetData(pets: Pet[]): void {
    if (!pets) return;

    pets.forEach((pet, index) => {
      if (pet) {
        console.log(`Pet ${index + 1}:`, {
          type: pet.type,
          age: pet.age,
          gender: pet.gender,
          species: pet.species,
          breed: pet.breed
        });
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page + 1;
    this.loadPets();
  }


  toggleModal(): void {
    this.showAddPetModal = !this.showAddPetModal;
    if (!this.showAddPetModal) {
      this.selectedPet = null;
    }
  }

  handleFileUpload(event: Event, petId: string): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      this.loadingPetIds.add(petId);

      this.petService.uploadAndModifyBackground(petId, file).subscribe({
        next: (response) => {
          this.loadingPetIds.delete(petId);
          this.loadPets(); // Recargar las mascotas después de la subida
        },
        error: (error) => {
          console.error('Error uploading file:', error);
          this.loadingPetIds.delete(petId);
        }
      });
    }
  }

  isLoading(petId: string): boolean {
    return this.loadingPetIds.has(petId);
  }

  openEditModal(pet: Pet): void {
    this.selectedPet = pet;
    this.showAddPetModal = true;
  }

  onPetUpdated(): void {
    this.loadPets();
    this.toggleModal();
  }
  openGallery(petId: string): void {
    this.gallerySelected.emit(petId);
  }

  closeGallery(): void {
    this.showGalleryModal = false;
    this.selectedPetId = null;
  }
}
