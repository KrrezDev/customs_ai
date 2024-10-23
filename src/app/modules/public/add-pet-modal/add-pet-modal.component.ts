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

  petTypes: PetType[] = [
    { value: 'Perro', label: 'Perro' },
    { value: 'Gato', label: 'Gato' },
    { value: 'Ave', label: 'Ave' },
    { value: 'Otro', label: 'Otro' }
  ];

  genderTypes: PetType[] = [
    { value: 'Macho', label: 'Macho' },
    { value: 'Hembra', label: 'Hembra' }
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
      imageUrl: [''] // Valor por defecto para la imagen
    });
  }

  onSubmit() {
    if (this.petForm.valid) {
      this.petService.createPet(this.petForm.value).subscribe({
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
    this.petForm.reset({
      imageUrl: '/api/placeholder/128/128'
    });
  }
}
