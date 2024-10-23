import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, map, Observable, of, switchMap, tap} from 'rxjs';
import {Pet, PetGalleryImage} from '../interfaces/pet.interface';
import {PageResponse} from "../interfaces/pagination.interface";
import {environment} from "../environments/environment.prod";

@Injectable({
  providedIn: 'root'
})
export class PetService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}


  getPets(page: number = 1, size: number = 3): Observable<Pet[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Pet[]>(this.API_URL, { params });
  }

  createPet(pet: Omit<Pet, 'id'>): Observable<Pet> {
    return this.http.post<Pet>(this.API_URL, pet);
  }

  uploadPetImage(petId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.put(`${this.API_URL}/${petId}/image`, formData);
  }

  getPetGallery(petId: string): Observable<PetGalleryImage[]> {
    return this.http.get<PetGalleryImage[]>(`${this.API_URL}/${petId}/gallery`);
  }

  createPetWithImage(pet: Omit<Pet, 'id'>, imageFile: File | null): Observable<Pet> {
    return this.createPet(pet).pipe(
      switchMap(createdPet => {
        if (imageFile) {
          return this.uploadPetImage(createdPet.id, imageFile).pipe(
            map(() => createdPet),
            catchError(error => {
              console.error('Error uploading image:', error);
              return of(createdPet);
            })
          );
        }
        return of(createdPet);
      })
    );
  }

  uploadToGallery(petId: string, file: File, description?: string, title?: string): Observable<PetGalleryImage> {
    const formData = new FormData();
    formData.append('file', file);
    if (description) formData.append('description', description);
    if (title) formData.append('title', title);

    return this.http.post<PetGalleryImage>(
      `${this.API_URL}/${petId}/gallery`,
      formData
    );
  }

  modifyImageBackground(imageId: string): Observable<any> {
    return this.http.post(
      `${this.API_URL}/gallery/${imageId}/modify-background`,
      {}
    );
  }

  uploadAndModifyBackground(petId: string, file: File): Observable<any> {
    return this.uploadToGallery(petId, file).pipe(
      switchMap(galleryImage => this.modifyImageBackground(galleryImage.id)),
      catchError(error => {
        console.error('Error in upload and modify process:', error);
        throw error;
      })
    );
  }
  updatePet(petId: string, pet: Partial<Pet>, imageFile: File | null = null): Observable<Pet> {
    if (imageFile) {
      return this.http.put<Pet>(`${this.API_URL}/${petId}`, pet).pipe(
        switchMap(updatedPet =>
          this.uploadPetImage(petId, imageFile).pipe(
            map(() => updatedPet)
          )
        )
      );
    }
    return this.http.put<Pet>(`${this.API_URL}/${petId}`, pet);
  }
}
