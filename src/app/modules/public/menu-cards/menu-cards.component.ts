import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {AddPetModalComponent} from "../add-pet-modal/add-pet-modal.component";
import {Pet} from "../../../../interfaces/pet.interface";
import {PetService} from "../../../../services/pet.service";
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
    NgIf
  ],
  templateUrl: './menu-cards.component.html',
  styleUrl: './menu-cards.component.scss'
})
export class MenuCardsComponent implements OnInit {
  pets: Pet[] = [];
  showAddPetModal = false;
  selectedPet: Pet | null = null;

  loadingPetIds: Set<string> = new Set();

  constructor(private petService: PetService) {}

  ngOnInit(): void {
    this.loadPets();
  }

  loadPets(): void {
    this.petService.getPets().subscribe({
      next: (pets) => {
        console.log('Pets received:', pets);
        this.validatePetData(pets);
        this.pets = pets;
      },
      error: (error) => {
        console.error('Error loading pets:', error);
      }
    });
  }
  private validatePetData(pets: Pet[]): void {
    pets.forEach((pet, index) => {
      console.log(`Pet ${index + 1}:`, {
        type: pet.type,
        age: pet.age,
        gender: pet.gender,
        species: pet.species,
        breed: pet.breed
      });
    });
  }
  toggleModal(): void {
    this.showAddPetModal = !this.showAddPetModal;
  }

  handleFileUpload(event: Event, petId: string): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      this.loadingPetIds.add(petId);
      this.petService.uploadAndModifyBackground(petId, file).subscribe({
        next: (response) => {
          this.loadingPetIds.delete(petId);        },
        error: (error) => {
          this.loadingPetIds.delete(petId);        }
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
  }
}

