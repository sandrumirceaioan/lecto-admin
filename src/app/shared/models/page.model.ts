export interface CourseImage {
    name: string;
    file: any;
    small?: string;
    original?: string;
}

export interface Page {
    _id?: string;
    titlu: string;
    url: string;
    imagine: CourseImage;
    descriere: string;
    status: boolean;
    createdBy?: any;
    createdAt?: Date;
}