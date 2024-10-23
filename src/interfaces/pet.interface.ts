export interface Pet {
  id: string;
  name: string;
  type: string;
  age: number;
  gender: string;
  species: string;
  breed: string;
  imageUrl: string;
}

export interface PetType {
  value: string;
  label: string;
}
