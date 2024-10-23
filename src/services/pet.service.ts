import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pet } from '../interfaces/pet.interface';

@Injectable({
  providedIn: 'root'
})
export class PetService {
  private readonly API_URL = '/api/pets';

  constructor(private http: HttpClient) {}

  getPets(): Observable<Pet[]> {
    return this.http.get<Pet[]>(this.API_URL);
  }

  createPet(pet: Omit<Pet, 'id'>): Observable<Pet> {
    return this.http.post<Pet>(this.API_URL, pet);
  }
}
