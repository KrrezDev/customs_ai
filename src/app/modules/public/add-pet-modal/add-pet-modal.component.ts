// src/app/modules/public/add-pet-modal/add-pet-modal.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgForOf } from '@angular/common';
import {PetType} from "../../../../interfaces/pet.interface";
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
export class AddPetModalComponent {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() petAdded = new EventEmitter<void>();

  petForm: FormGroup;
  selectedImage: File | null = null;
  previewUrl: string = '/api/placeholder/128/128';

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

  onFileSelected(event: Event) {
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

  onSubmit() {
    if (this.petForm.valid) {
      this.petService.createPetWithImage(this.petForm.value, this.selectedImage).subscribe({
        next: () => {
          this.petAdded.emit();
          this.close();
        },
        error: (error) => {
          console.error('Error creating pet:', error);
        }
      });
    }
  }

  close() {
    this.closeModal.emit();
    this.petForm.reset();
    this.selectedImage = null;
    this.previewUrl = '/api/placeholder/128/128';
  }
}
