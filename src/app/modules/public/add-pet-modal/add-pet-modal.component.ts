// src/app/modules/public/add-pet-modal/add-pet-modal.component.ts
import {Component, Input, Output, EventEmitter, SimpleChanges, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgForOf } from '@angular/common';
import {Pet, PetType} from "../../../../interfaces/pet.interface";
import {PetService} from "../../../../services/pet.service";


@Component({
  selector: 'app-add-pet-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './add-pet-modal.component.html',
  styleUrl: './add-pet-modal.component.scss'
})
export class AddPetModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() petToEdit: Pet | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() petAdded = new EventEmitter<void>();
  @Output() petUpdated = new EventEmitter<void>();

petForm!: FormGroup;
selectedImage: File | null = null;
  previewUrl: string = '/api/placeholder/128/128';
  isEditMode = false;

  petTypes: PetType[] = [
    { value: 'Dog', label: 'Dog' },
    { value: 'Cat', label: 'Cat' },
    { value: 'Bird', label: 'Bird' },
    { value: 'Other', label: 'Other' }
  ];

  genderTypes: PetType[] = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' }
  ];

  constructor(
    private fb: FormBuilder,
    private petService: PetService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.checkEditMode();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Si cambia petToEdit, actualizamos el formulario
    if (changes['petToEdit'] && changes['petToEdit'].currentValue) {
      this.checkEditMode();
    }
  }

  private initForm(): void {
    this.petForm = this.fb.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      species: ['', [Validators.required]],
      age: ['', [Validators.required, Validators.min(0)]],
      gender: ['', [Validators.required]],
      breed: ['', [Validators.required]],
      imageUrl: ['']
    });
  }

  private checkEditMode(): void {
    if (this.petToEdit) {
      this.isEditMode = true;
      this.previewUrl = this.petToEdit.imageUrl || '/api/placeholder/128/128';
      this.petForm.patchValue({
        name: this.petToEdit.name,
        type: this.petToEdit.type,
        species: this.petToEdit.species,
        age: this.petToEdit.age,
        gender: this.petToEdit.gender,
        breed: this.petToEdit.breed,
        imageUrl: this.petToEdit.imageUrl
      });
    } else {
      this.isEditMode = false;
      this.resetForm();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedImage = file;

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.petForm.valid) {
      if (this.isEditMode && this.petToEdit) {
        this.updatePet();
      } else {
        this.createPet();
      }
    }
  }

  private createPet(): void {
    this.petService.createPetWithImage(this.petForm.value, this.selectedImage).subscribe({
      next: () => {
        this.petAdded.emit();
        this.close();
      },
      error: (error) => {
        console.error('Error creating pet:', error);
        // Aquí podrías agregar un manejo de errores más específico
      }
    });
  }

  private updatePet(): void {
    if (!this.petToEdit) return;

    this.petService.updatePet(
      this.petToEdit.id,
      this.petForm.value,
      this.selectedImage
    ).subscribe({
      next: () => {
        this.petUpdated.emit();
        this.close();
      },
      error: (error) => {
        console.error('Error updating pet:', error);
        // Aquí podrías agregar un manejo de errores más específico
      }
    });
  }

  private resetForm(): void {
    this.petForm.reset();
    this.selectedImage = null;
    this.previewUrl = '/api/placeholder/128/128';
  }

  close(): void {
    this.closeModal.emit();
    this.resetForm();
    this.isEditMode = false;
    this.petToEdit = null;
  }

  // Getters para facilitar la validación en la plantilla
  get nameControl() { return this.petForm.get('name'); }
  get typeControl() { return this.petForm.get('type'); }
  get speciesControl() { return this.petForm.get('species'); }
  get ageControl() { return this.petForm.get('age'); }
  get genderControl() { return this.petForm.get('gender'); }
  get breedControl() { return this.petForm.get('breed'); }
}
