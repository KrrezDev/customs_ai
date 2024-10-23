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


export interface PetGalleryImage {
  id: string;
  petId: string;
  imageUrl: string;
  description: string | null;
  uploadDate: string;
  title: string | null;
}

export interface Photo {
  src: string;
  alt: string;
}
