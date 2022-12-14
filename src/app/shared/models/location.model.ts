export interface OfertaLocatie {
  nume: string; // 6 nopti demipensiune, 7 nopti demipensiune, 6 nopti pensiune completa, 7 nopti pensiune completa
  pret: number; // 4090
  status: boolean;
}

export interface GalleryImage {
  name: string;
  file: any;
  small?: string;
  original?: string;
  main?: boolean;
}

export interface Location {
  _id?: string;
  locatie: string;
  url: string;
  imagine?: string;
  galerie?: GalleryImage[];
  descriere: string;
  resort: any;
  status: boolean;
  createdBy?: any;
  createdAt?: Date;
}