export interface TeacherImage {
  name: string;
  file: any;
  small?: string;
  original?: string;
}

export class Teacher {
  _id?: string;
  nume: string;
  experienta: string;
  descriere: string;
  imagine: TeacherImage;
  email: string;
  telefon: string;
  createdBy?: any;
  createdAt?: Date;
}